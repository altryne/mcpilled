import { supabase } from './supabase';

const DEFAULT_LIMIT = 10;

// Get entry by readable ID
export const getNumericId = async (id) => {
  if (!id) {
    return null;
  }
  
  if (id.match(/\d{4}-\d{2}-\d{2}-?\d{0,2}/)) {
    return id;
  }
  
  const { data, error } = await supabase
    .from('entries')
    .select('id')
    .eq('readable_id', id)
    .limit(1);
    
  if (error) {
    console.error('Error fetching entry by readable ID:', error);
    return null;
  }
  
  if (data && data.length > 0) {
    return data[0].id;
  }
  
  return null;
};

// Get the first entry ID (most recent by date)
const getFirstEntryId = async () => {
  const { data, error } = await supabase
    .from('entries')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);
    
  if (error) {
    console.error('Error fetching first entry ID:', error);
    return null;
  }
  
  if (data && data.length > 0) {
    return data[0].id;
  }
  
  return null;
};

// Get entries with filters
export const getEntries = async ({
  limit: entriesLimit,
  sort,
  theme,
  tech,
  blockchain,
  collection: entriesCollection,
  cursor,
  startAtId,
  starred,
} = {}) => {
  const resp = {
    entries: [],
    hasPrev: null, // This is only set if there's a cursor
    hasNext: false,
  };
  
  const respLimit = entriesLimit ? entriesLimit : DEFAULT_LIMIT;
  const startAtNumericId = await getNumericId(startAtId);
  
  // Start building the query
  let query = supabase
    .from('entries')
    .select(`
      *,
      entry_filters(filter_type, filter_value),
      entry_links(*)
    `)
    .order('id', { ascending: sort === 'Ascending' });
  
  // Apply filters
  if (entriesCollection) {
    query = query.contains('collection', [entriesCollection]);
  } else if (theme && theme.length) {
    query = query.in('entry_filters.filter_type', ['theme'])
      .in('entry_filters.filter_value', theme);
  } else if (tech && tech.length) {
    query = query.in('entry_filters.filter_type', ['tech'])
      .in('entry_filters.filter_value', tech);
  } else if (blockchain && blockchain.length) {
    query = query.in('entry_filters.filter_type', ['blockchain'])
      .in('entry_filters.filter_value', blockchain);
  } else if (starred) {
    query = query.eq('starred', true);
  }
  
  // Apply cursor or startAtId
  if (cursor) {
    if (sort === 'Ascending') {
      query = query.gt('id', cursor);
    } else {
      query = query.lt('id', cursor);
    }
  } else if (startAtId && startAtNumericId) {
    query = query.gte('id', startAtNumericId);
  }
  
  // Apply limit
  query = query.limit(respLimit + 1);
  
  // Execute query
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching entries:', error);
    return resp;
  }
  
  if (data && data.length > 0) {
    // Process entries exactly like Firebase did
    data.forEach(entry => {
      if (resp.entries.length < respLimit) {
        // Transform the entry to match Firebase structure
        const processedEntry = {
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
          scamAmountDetails: entry.scam_amount_details,
          collection: entry.collection,
          starred: entry.starred,
          filters: {
            theme: entry.entry_filters?.filter(f => f.filter_type === 'theme').map(f => f.filter_value) || [],
            tech: entry.entry_filters?.filter(f => f.filter_type === 'tech').map(f => f.filter_value) || [],
            blockchain: entry.entry_filters?.filter(f => f.filter_type === 'blockchain').map(f => f.filter_value) || []
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
        resp.entries.push(processedEntry);
      } else {
        resp.hasNext = true;
      }
    });
    
    // Check if this is the first entry available
    if (cursor || startAtNumericId) {
      const firstId = cursor || startAtNumericId;
      const firstEntryId = await getFirstEntryId();
      resp.hasPrev = firstEntryId !== firstId;
    }
  }
  
  return resp;
};

// Get all entries for pagination
const ALL_ENTRIES_LIMIT = 50;
export const getAllEntries = async ({ cursor, direction }) => {
  const resp = {
    entries: [],
    hasPrev: false,
    hasNext: false,
  };
  
  let query = supabase
    .from('entries')
    .select(`
      *,
      entry_filters(filter_type, filter_value),
      entry_links(*)
    `)
    .order('id', { ascending: direction === 'prev' });
  
  // Apply cursor
  if (cursor) {
    if (direction === 'prev') {
      query = query.gt('id', cursor);
    } else {
      query = query.lt('id', cursor);
    }
  }
  
  // Apply limit
  query = query.limit(ALL_ENTRIES_LIMIT + 1);
  
  // Execute query
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching all entries:', error);
    return resp;
  }
  
  if (data && data.length > 0) {
    if (direction === 'next') {
      data.forEach(entry => {
        if (resp.entries.length < ALL_ENTRIES_LIMIT) {
          resp.entries.push({
            _key: entry.id,
            ...entry,
            filters: {
              theme: entry.entry_filters?.filter(f => f.filter_type === 'theme').map(f => f.filter_value) || [],
              tech: entry.entry_filters?.filter(f => f.filter_type === 'tech').map(f => f.filter_value) || [],
              blockchain: entry.entry_filters?.filter(f => f.filter_type === 'blockchain').map(f => f.filter_value) || []
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
          });
        } else {
          resp.hasNext = true;
        }
      });
    } else {
      data.forEach(entry => {
        resp.entries.push({
          _key: entry.id,
          ...entry,
          filters: {
            theme: entry.entry_filters?.filter(f => f.filter_type === 'theme').map(f => f.filter_value) || [],
            tech: entry.entry_filters?.filter(f => f.filter_type === 'tech').map(f => f.filter_value) || [],
            blockchain: entry.entry_filters?.filter(f => f.filter_type === 'blockchain').map(f => f.filter_value) || []
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
        });
        if (resp.entries.length === ALL_ENTRIES_LIMIT) {
          resp.hasNext = true;
        }
      });
      resp.entries.reverse();
      if (resp.entries.length > 50) {
        resp.entries = resp.entries.slice(1);
      }
    }
    
    // Check if the first entry in this group is also the first document in the
    // collection or if there are newer entries that could be fetched
    if (cursor) {
      const firstEntryId = await getFirstEntryId();
      if (resp.entries[0].id !== firstEntryId) {
        resp.hasPrev = true;
      }
    }
  }
  
  return resp;
};

// Delete all entries
export const deleteAllEntries = async () => {
  const { error } = await supabase
    .from('entries')
    .delete()
    .neq('id', 0); // Delete all entries
    
  if (error) {
    console.error('Error deleting entries:', error);
    return false;
  }
  
  return true;
};
