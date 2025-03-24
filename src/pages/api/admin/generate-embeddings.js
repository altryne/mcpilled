import { supabase } from '../../../db/supabase';
import OpenAI from 'openai';

// Initialize OpenAI client with server-side API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Admin endpoint to generate embeddings for all entries
 * This should be protected in production with proper authentication
 */
export default async function handler(req, res) {
  // In production, add authentication check here
  // if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  try {
    // Get entries that need embeddings
    const { data: queuedEntries, error: queueError } = await supabase
      .from('embedding_queue')
      .select('entry_id')
      .eq('processed', false)
      .limit(50);
      
    if (queueError) {
      console.error('Error fetching queued entries:', queueError);
      return res.status(500).json({ error: 'Failed to fetch queued entries' });
    }
    
    if (!queuedEntries || queuedEntries.length === 0) {
      return res.status(200).json({ message: 'No entries need embeddings' });
    }
    
    const entryIds = queuedEntries.map(entry => entry.entry_id);
    
    // Get the actual entries
    const { data: entries, error: entriesError } = await supabase
      .from('entries')
      .select('id, title, body')
      .in('id', entryIds);
      
    if (entriesError) {
      console.error('Error fetching entries:', entriesError);
      return res.status(500).json({ error: 'Failed to fetch entries' });
    }
    
    // Process each entry
    const results = [];
    for (const entry of entries) {
      try {
        // Combine title and body for better semantic understanding
        const text = `${entry.title} ${entry.body}`;
        
        // Generate embedding
        const response = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: text,
        });
        
        const embedding = response.data[0].embedding;
        
        // Store the embedding
        const { error: upsertError } = await supabase
          .from('entry_embeddings')
          .upsert({ 
            entry_id: entry.id,
            embedding,
            created_at: new Date().toISOString()
          });
          
        if (upsertError) {
          console.error(`Error storing embedding for entry ${entry.id}:`, upsertError);
          results.push({ id: entry.id, success: false, error: 'Failed to store embedding' });
          continue;
        }
        
        // Mark as processed in the queue
        await supabase
          .from('embedding_queue')
          .update({ processed: true, updated_at: new Date().toISOString() })
          .eq('entry_id', entry.id);
          
        results.push({ id: entry.id, success: true });
      } catch (error) {
        console.error(`Error processing entry ${entry.id}:`, error);
        results.push({ id: entry.id, success: false, error: error.message });
      }
    }
    
    return res.status(200).json({ 
      processed: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    });
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return res.status(500).json({ error: 'Failed to generate embeddings' });
  }
}
