-- Re-enable RLS after migration
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entry_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entry_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attributions ENABLE ROW LEVEL SECURITY;
