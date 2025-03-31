import { supabase } from '../../../db/supabase';

// Use direct fetch to OpenAI API instead of the SDK
// This avoids Node.js specific functionality that causes issues in Cloudflare Workers
async function generateEmbedding(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const result = await response.json();
  return result.data[0].embedding;
}

/**
 * Search endpoint supporting multiple search modes:
 * - hybrid: combines full-text search and vector similarity
 * - vector: uses only vector similarity search
 * - text: uses only full-text search
 * This keeps your OpenAI API key secure by running server-side
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed, use GET' });
  }

  try {
    const { query, filters = {}, mode = 'hybrid' } = req.query;
    
    if (!query || query.length < 3) {
      return res.status(400).json({ 
        hits: [],
        message: 'Query must be at least 3 characters' 
      });
    }
    
    // Generate embedding for the search query (for vector and hybrid modes)
    let queryEmbedding = null;
    if (mode === 'vector' || mode === 'hybrid') {
      try {
        console.log('Generating embedding with OpenAI model: text-embedding-3-small');
        
        // Use direct fetch instead of OpenAI SDK
        queryEmbedding = await generateEmbedding(query);
        
        console.log('Successfully generated embedding');
      } catch (error) {
        console.error('Error generating embedding:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
          details: error.details || 'No details provided'
        });
        // If in vector-only mode and embedding fails, return error
        if (mode === 'vector') {
          return res.status(500).json({ 
            error: 'Failed to generate embedding for vector search',
            details: error.message
          });
        }
        // For hybrid mode, we'll continue with text search only
        console.log('Falling back to text-only search due to embedding generation failure');
      }
    }
    
    // Get all entries with their embeddings
    let dbQuery = supabase
      .from('entries')
      .select(`
        *,
        entry_filters(filter_type, filter_value),
        entry_links(*),
        entry_embeddings(embedding)
      `);
    
    // Apply filters if provided
    if (filters.theme && filters.theme.length) {
      dbQuery = dbQuery.eq('entry_filters.filter_type', 'theme')
        .in('entry_filters.filter_value', filters.theme.split(','));
    }
    
    if (filters.category && filters.category.length) {
      dbQuery = dbQuery.eq('entry_filters.filter_type', 'category')
        .in('entry_filters.filter_value', filters.category.split(','));
    }
    
    if (filters.server && filters.server.length) {
      dbQuery = dbQuery.eq('entry_filters.filter_type', 'server')
        .in('entry_filters.filter_value', filters.server.split(','));
    }
    
    // Execute the query
    const { data, error } = await dbQuery;
    
    if (error) {
      console.error('Error searching entries:', error);
      return res.status(500).json({ error: 'Failed to search entries' });
    }
    
    // Process results based on search mode
    const results = data.map(entry => {
      // Calculate text match score
      let textScore = 0;
      if (mode === 'text' || mode === 'hybrid') {
        const titleLower = entry.title.toLowerCase();
        const bodyLower = entry.body.toLowerCase();
        const queryLower = query.toLowerCase();
        
        // Check for exact matches
        const titleExactMatch = titleLower.includes(queryLower);
        const bodyExactMatch = bodyLower.includes(queryLower);
        
        // Calculate text score based on match location and exactness
        if (titleExactMatch) {
          textScore = 0.9; // High score for title match
        } else if (bodyExactMatch) {
          textScore = 0.6; // Medium score for body match
        } else {
          // Check for partial matches (word by word)
          const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
          const titleWords = titleLower.split(/\s+/);
          const bodyWords = bodyLower.split(/\s+/);
          
          let titleWordMatches = 0;
          let bodyWordMatches = 0;
          
          queryWords.forEach(queryWord => {
            if (titleWords.some(word => word.includes(queryWord))) {
              titleWordMatches++;
            }
            if (bodyWords.some(word => word.includes(queryWord))) {
              bodyWordMatches++;
            }
          });
          
          if (queryWords.length > 0) {
            const titleMatchRatio = titleWordMatches / queryWords.length;
            const bodyMatchRatio = bodyWordMatches / queryWords.length;
            
            textScore = Math.max(
              titleMatchRatio * 0.7, // Weight title matches higher
              bodyMatchRatio * 0.4   // Weight body matches lower
            );
          }
        }
      }
      
      // Calculate vector similarity if embedding exists
      let vectorScore = 0;
      if ((mode === 'vector' || mode === 'hybrid') && queryEmbedding && 
          entry.entry_embeddings && entry.entry_embeddings.length > 0) {
        const embedding = entry.entry_embeddings[0].embedding;
        vectorScore = calculateCosineSimilarity(queryEmbedding, embedding);
      }
      
      // Calculate final score based on search mode
      let finalScore = 0;
      switch (mode) {
        case 'hybrid':
          finalScore = (0.6 * textScore) + (0.4 * vectorScore);
          break;
        case 'vector':
          finalScore = vectorScore;
          break;
        case 'text':
          finalScore = textScore;
          break;
        default:
          finalScore = (0.6 * textScore) + (0.4 * vectorScore); // Default to hybrid
      }
      
      // Generate highlighted text for results
      const titleHighlight = highlightText(entry.title, query);
      const bodyHighlight = highlightText(entry.body, query);
      
      // Format the result to match expected format
      return {
        id: entry.id,
        readableId: entry.readable_id,
        title: entry.title,
        date: entry.date,
        body: entry.body,
        _highlightResult: {
          title: {
            value: titleHighlight,
            matchLevel: textScore > 0.5 ? 'full' : 'partial'
          },
          body: {
            value: bodyHighlight,
            matchLevel: textScore > 0.3 ? 'full' : 'partial'
          }
        },
        _score: finalScore,
        _textScore: textScore,
        _vectorScore: vectorScore
      };
    });
    
    // Sort by score and return top results
    const hits = results
      .filter(result => result._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 10);
    
    return res.status(200).json({ 
      hits,
      mode,
      query,
      stats: {
        totalResults: hits.length,
        searchMode: mode,
        vectorSearched: mode !== 'text' && queryEmbedding !== null,
        textSearched: mode !== 'vector'
      }
    });
  } catch (error) {
    console.error('Error in search:', error);
    return res.status(500).json({ error: 'Failed to perform search' });
  }
}

// Helper function to calculate cosine similarity between two vectors
function calculateCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (normA * normB);
}

// Helper function to highlight matching text
function highlightText(text, query) {
  if (!text) return '';
  
  // Simple highlighting - in production you'd use more sophisticated methods
  const regex = new RegExp(`(${query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<em>$1</em>');
}
