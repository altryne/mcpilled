-- Function to enable pgvector extension
CREATE OR REPLACE FUNCTION enable_pgvector()
RETURNS text AS $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS vector;
  RETURN 'pgvector extension enabled';
EXCEPTION WHEN OTHERS THEN
  RETURN 'Error enabling pgvector: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create embedding_queue table
CREATE OR REPLACE FUNCTION create_embedding_queue_table()
RETURNS text AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS embedding_queue (
    entry_id TEXT PRIMARY KEY,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Add foreign key if entries table exists
  BEGIN
    ALTER TABLE embedding_queue 
    ADD CONSTRAINT fk_embedding_queue_entry 
    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE;
  EXCEPTION WHEN OTHERS THEN
    -- If entries table doesn't exist yet, we'll skip the foreign key
    NULL;
  END;
  
  RETURN 'embedding_queue table created';
EXCEPTION WHEN OTHERS THEN
  RETURN 'Error creating embedding_queue table: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create entry_embeddings table
CREATE OR REPLACE FUNCTION create_entry_embeddings_table()
RETURNS text AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS entry_embeddings (
    id SERIAL PRIMARY KEY,
    entry_id TEXT NOT NULL,
    embedding vector(1536), -- OpenAI's text-embedding-3-small uses 1536 dimensions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Add foreign key if entries table exists
  BEGIN
    ALTER TABLE entry_embeddings 
    ADD CONSTRAINT fk_entry_embeddings_entry 
    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE;
  EXCEPTION WHEN OTHERS THEN
    -- If entries table doesn't exist yet, we'll skip the foreign key
    NULL;
  END;
  
  -- Add unique constraint
  ALTER TABLE entry_embeddings 
  ADD CONSTRAINT unique_entry_embedding UNIQUE (entry_id);
  
  -- Create index for vector search if not exists
  BEGIN
    CREATE INDEX IF NOT EXISTS entry_embeddings_vector_idx 
    ON entry_embeddings 
    USING ivfflat (embedding vector_l2_ops);
  EXCEPTION WHEN OTHERS THEN
    -- If index creation fails, we'll continue anyway
    NULL;
  END;
  
  RETURN 'entry_embeddings table created';
EXCEPTION WHEN OTHERS THEN
  RETURN 'Error creating entry_embeddings table: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to queue all entries for embedding generation
CREATE OR REPLACE FUNCTION queue_all_entries_for_embedding()
RETURNS text AS $$
DECLARE
  entry_count INTEGER;
BEGIN
  -- Insert all entries into the queue
  INSERT INTO embedding_queue (entry_id, processed)
  SELECT id, FALSE FROM entries
  ON CONFLICT (entry_id) 
  DO UPDATE SET processed = FALSE, updated_at = NOW();
  
  GET DIAGNOSTICS entry_count = ROW_COUNT;
  
  RETURN entry_count || ' entries queued for embedding generation';
EXCEPTION WHEN OTHERS THEN
  RETURN 'Error queuing entries: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
