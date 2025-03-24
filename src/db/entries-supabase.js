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
  category,
  server,
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
  
  // Apply collection filter if specified
  if (entriesCollection) {
    query = query.contains('collection', [entriesCollection]);
  } else if (starred) {
    // Apply starred filter if specified
    query = query.eq('starred', true);
  } else {
    // Apply theme, category, and server filters if any are specified
    // We'll use a different approach that works better with Supabase
    
    const hasThemeFilters = theme && theme.length > 0;
    const hasCategoryFilters = category && category.length > 0;
    const hasServerFilters = server && server.length > 0;
    
    // Only apply filters if at least one filter type is specified
    if (hasThemeFilters || hasCategoryFilters || hasServerFilters) {
      // We'll fetch all entries and then filter them in memory
      // This is a workaround for the limitations of Supabase's query builder
      // with complex filter conditions across nested relations
    }
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
    // Filter entries based on filter criteria if needed
    let filteredData = data;
    
    // If we're not using collection or starred filters, apply our custom filtering
    if (!entriesCollection && !starred) {
      const hasThemeFilters = theme && theme.length > 0;
      const hasCategoryFilters = category && category.length > 0;
      const hasServerFilters = server && server.length > 0;
      
      if (hasThemeFilters || hasCategoryFilters || hasServerFilters) {
        filteredData = data.filter(entry => {
          const entryFilters = entry.entry_filters || [];
          
          // Check if the entry matches all the filter criteria
          const matchesTheme = !hasThemeFilters || entryFilters.some(
            filter => filter.filter_type === 'theme' && theme.includes(filter.filter_value)
          );
          
          const matchesCategory = !hasCategoryFilters || entryFilters.some(
            filter => filter.filter_type === 'category' && category.includes(filter.filter_value)
          );
          
          const matchesServer = !hasServerFilters || entryFilters.some(
            filter => filter.filter_type === 'server' && server.includes(filter.filter_value)
          );
          
          // Entry must match all specified filter types
          return matchesTheme && matchesCategory && matchesServer;
        });
      }
    }
    
    // Process entries exactly like Firebase did
    filteredData.forEach(entry => {
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
          starred: entry.starred,
          collection: entry.collection,
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
