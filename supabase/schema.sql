-- Create entries table
CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  readable_id TEXT NOT NULL,
  date DATE NOT NULL,
  body TEXT NOT NULL,
  faicon TEXT,
  icon TEXT,
  image JSONB,
  scam_amount_details JSONB NOT NULL,
  collection TEXT[],
  starred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS entries_readable_id_idx ON entries (readable_id);
CREATE INDEX IF NOT EXISTS entries_date_idx ON entries (date);

-- Create entry_filters table for many-to-many relationships
CREATE TABLE IF NOT EXISTS entry_filters (
  entry_id TEXT REFERENCES entries(id) ON DELETE CASCADE,
  filter_type TEXT NOT NULL,
  filter_value TEXT NOT NULL,
  PRIMARY KEY (entry_id, filter_type, filter_value)
);

CREATE INDEX IF NOT EXISTS entry_filters_type_value_idx ON entry_filters (filter_type, filter_value);

-- Create entry_links table
CREATE TABLE IF NOT EXISTS entry_links (
  id SERIAL PRIMARY KEY,
  entry_id TEXT REFERENCES entries(id) ON DELETE CASCADE,
  link_text TEXT NOT NULL,
  href TEXT NOT NULL,
  extra_text TEXT,
  archive_href TEXT,
  archive_tweet_path TEXT,
  archive_tweet_alt TEXT,
  archive_tweet_assets JSONB
);

CREATE INDEX IF NOT EXISTS entry_links_entry_id_idx ON entry_links (entry_id);

-- Create attributions table
CREATE TABLE IF NOT EXISTS attributions (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  href TEXT,
  sort_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS attributions_type_idx ON attributions (type);
