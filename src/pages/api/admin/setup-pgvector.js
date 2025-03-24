import { supabase } from '../../../db/supabase';

/**
 * Admin endpoint to set up pgvector extension and required tables
 * This should be protected in production with proper authentication
 */
export default async function handler(req, res) {
  // In production, add authentication check here
  // if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  try {
    // Enable pgvector extension
    const enableExtension = await supabase.rpc('enable_pgvector');
    
    // Create embedding_queue table
    const createQueueTable = await supabase.rpc('create_embedding_queue_table');
    
    // Create entry_embeddings table
    const createEmbeddingsTable = await supabase.rpc('create_entry_embeddings_table');
    
    return res.status(200).json({ 
      message: 'Database setup completed successfully',
      details: {
        pgvector: enableExtension.error ? 'Failed' : 'Success',
        queue_table: createQueueTable.error ? 'Failed' : 'Success',
        embeddings_table: createEmbeddingsTable.error ? 'Failed' : 'Success'
      }
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    return res.status(500).json({ 
      error: 'Failed to set up database',
      details: error.message
    });
  }
}
