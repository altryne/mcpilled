import { supabase } from './supabase';
import { getNumericId } from './entries-supabase';

export const getEntry = async (id) => {
  // If id is not provided, throw an error
  if (!id) {
    throw new Error('invalid-argument');
  }
  
  // Check if the id is a readable id or a numeric id
  let query = supabase
    .from('entries')
    .select(`
      *,
      entry_filters(filter_type, filter_value),
      entry_links(*)
    `);
  
  // If it's a readable ID (slug), search by readable_id
  if (isNaN(id)) {
    query = query.eq('readable_id', id);
  } else {
    // If it's a numeric ID, search by id
    query = query.eq('id', id);
  }
  
  // Execute query
  const { data, error } = await query.limit(1);
  
  if (error) {
    console.error('Error fetching single entry:', error);
    throw new Error('not-found');
  }
  
  if (!data || data.length === 0) {
    throw new Error('not-found');
  }
  
  // Transform the entry to match the expected structure
  const entry = data[0];
  return {
    _key: entry.id,
    id: entry.id,
    title: entry.title,
    shortTitle: entry.short_title,
    readableId: entry.readable_id,
    date: entry.date,
    body: entry.body,
    faicon: entry.faicon,
    icon: entry.icon,
    image: entry.image,
    collection: entry.collection,
    starred: entry.starred,
    filters: {
      theme: entry.entry_filters?.filter(f => f.filter_type === 'theme').map(f => f.filter_value) || [],
      category: entry.entry_filters?.filter(f => f.filter_type === 'category').map(f => f.filter_value) || [],
      server: entry.entry_filters?.filter(f => f.filter_type === 'server').map(f => f.filter_value) || [],
      sort: "Descending"
    },
    links: (entry.entry_links || []).map(link => ({
      id: link.id,
      linkText: link.link_text,
      href: link.href,
      extraText: link.extra_text,
      archiveHref: link.archive_href,
      archiveTweetPath: link.archive_tweet_path,
      archiveTweetAlt: link.archive_tweet_alt,
      archiveTweetAssets: link.archive_tweet_assets
    }))
  };
};
