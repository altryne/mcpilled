import { supabase } from '../../../db/supabase';
import OpenAI from 'openai';

// Initialize OpenAI client with server-side API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embeddings for text using OpenAI's embedding model
 * This runs server-side only, keeping your API key secure
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  try {
    const { text, entryId } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Generate embedding using OpenAI
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    
    const embedding = response.data[0].embedding;
    
    // If entryId is provided, store the embedding in Supabase
    if (entryId) {
      const { error } = await supabase
        .from('entry_embeddings')
        .upsert({ 
          entry_id: entryId,
          embedding,
          created_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error storing embedding:', error);
        return res.status(500).json({ error: 'Failed to store embedding' });
      }
    }
    
    return res.status(200).json({ embedding });
  } catch (error) {
    console.error('Error generating embedding:', error);
    return res.status(500).json({ error: 'Failed to generate embedding' });
  }
}
