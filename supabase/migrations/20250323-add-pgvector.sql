-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table to store embeddings for entries
CREATE TABLE IF NOT EXISTS entry_embeddings (
  id SERIAL PRIMARY KEY,
  entry_id TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  embedding vector(1536), -- OpenAI's text-embedding-3-small uses 1536 dimensions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Each entry should only have one embedding
  CONSTRAINT unique_entry_embedding UNIQUE (entry_id)
);

-- Create an index for faster vector similarity searches
CREATE INDEX IF NOT EXISTS entry_embeddings_vector_idx ON entry_embeddings USING ivfflat (embedding vector_l2_ops);

-- Create a function to generate embeddings for entries
CREATE OR REPLACE FUNCTION generate_entry_embedding() 
RETURNS TRIGGER AS $$
BEGIN
  -- This is just a placeholder - the actual embedding generation happens in the API
  -- We'll use this trigger to track when entries need new embeddings
  INSERT INTO embedding_queue (entry_id, processed)
  VALUES (NEW.id, FALSE)
  ON CONFLICT (entry_id) 
  DO UPDATE SET processed = FALSE, updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a queue table to track entries needing embeddings
CREATE TABLE IF NOT EXISTS embedding_queue (
  entry_id TEXT PRIMARY KEY REFERENCES entries(id) ON DELETE CASCADE,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger to add entries to the embedding queue when they're created or updated
DROP TRIGGER IF EXISTS entry_embedding_trigger ON entries;
CREATE TRIGGER entry_embedding_trigger
AFTER INSERT OR UPDATE OF title, body ON entries
FOR EACH ROW
EXECUTE FUNCTION generate_entry_embedding();
