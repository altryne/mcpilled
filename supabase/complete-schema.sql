-- Create entries table
CREATE TABLE IF NOT EXISTS public.entries (
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

-- Create indexes for entries
CREATE INDEX IF NOT EXISTS entries_readable_id_idx ON public.entries (readable_id);
CREATE INDEX IF NOT EXISTS entries_date_idx ON public.entries (date);

-- Create entry_filters table for many-to-many relationships
CREATE TABLE IF NOT EXISTS public.entry_filters (
  entry_id TEXT REFERENCES public.entries(id) ON DELETE CASCADE,
  filter_type TEXT NOT NULL,
  filter_value TEXT NOT NULL,
  PRIMARY KEY (entry_id, filter_type, filter_value)
);

-- Create index for entry_filters
CREATE INDEX IF NOT EXISTS entry_filters_type_value_idx ON public.entry_filters (filter_type, filter_value);

-- Create entry_links table
CREATE TABLE IF NOT EXISTS public.entry_links (
  id SERIAL PRIMARY KEY,
  entry_id TEXT REFERENCES public.entries(id) ON DELETE CASCADE,
  link_text TEXT NOT NULL,
  href TEXT NOT NULL,
  extra_text TEXT,
  archive_href TEXT,
  archive_tweet_path TEXT,
  archive_tweet_alt TEXT,
  archive_tweet_assets JSONB
);

-- Create index for entry_links
CREATE INDEX IF NOT EXISTS entry_links_entry_id_idx ON public.entry_links (entry_id);

-- Create attributions table
CREATE TABLE IF NOT EXISTS public.attributions (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  href TEXT,
  sort_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for attributions
CREATE INDEX IF NOT EXISTS attributions_type_idx ON public.attributions (type);

-- Set up Row Level Security (RLS) policies
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entry_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entry_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attributions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON public.entries FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.entry_filters FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.entry_links FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.attributions FOR SELECT USING (true);

-- Create policies for authenticated write access
CREATE POLICY "Allow authenticated insert" ON public.entries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON public.entries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON public.entries FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON public.entry_filters FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON public.entry_filters FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON public.entry_filters FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON public.entry_links FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON public.entry_links FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON public.entry_links FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON public.attributions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON public.attributions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON public.attributions FOR DELETE USING (auth.role() = 'authenticated');
