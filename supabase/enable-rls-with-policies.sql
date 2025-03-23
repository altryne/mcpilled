-- Enable RLS
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entry_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entry_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attributions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to entries"
ON public.entries FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to entry_filters"
ON public.entry_filters FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to entry_links"
ON public.entry_links FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to attributions"
ON public.attributions FOR SELECT
TO public
USING (true);

-- Restrict insert/update/delete to authenticated users only
CREATE POLICY "Allow authenticated users to modify entries"
ON public.entries FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to modify entry_filters"
ON public.entry_filters FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to modify entry_links"
ON public.entry_links FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to modify attributions"
ON public.attributions FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
