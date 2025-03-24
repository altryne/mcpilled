import { supabase } from './supabase';
import { stripHtml } from '../js/utilities';

// Upload a new entry or update an existing one
export const uploadEntry = async (entry) => {
  // If entry has an ID, update it instead of creating a new one
  if (entry.id) {
    console.log('Updating existing entry:', entry.id);
    
    // Update the entry
    const { data: entryData, error: entryError } = await supabase
      .from('entries')
      .update({
        title: entry.title,
        short_title: entry.shortTitle,
        readable_id: entry.readableId,
        date: entry.date,
        body: entry.body,
        faicon: entry.faicon,
        icon: entry.icon,
        image: entry.image,
        collection: entry.collection || [],
        starred: entry.starred || false
      })
      .eq('id', entry.id);
      
    if (entryError) {
      console.error('Error updating entry:', entryError);
      throw entryError;
    }
    
    // Delete existing filters for this entry
    const { error: deleteFilterError } = await supabase
      .from('entry_filters')
      .delete()
      .eq('entry_id', entry.id);
      
    if (deleteFilterError) {
      console.error('Error deleting existing filters:', deleteFilterError);
      throw deleteFilterError;
    }
    
    // Delete existing links for this entry
    const { error: deleteLinksError } = await supabase
      .from('entry_links')
      .delete()
      .eq('entry_id', entry.id);
      
    if (deleteLinksError) {
      console.error('Error deleting existing links:', deleteLinksError);
      throw deleteLinksError;
    }
    
    // Insert new filters
    if (entry.filters) {
      const filterEntries = [];
      
      // Add theme filters
      if (entry.filters.theme && entry.filters.theme.length > 0) {
        entry.filters.theme.forEach(theme => {
          filterEntries.push({
            entry_id: entry.id,
            filter_type: 'theme',
            filter_value: theme
          });
        });
      }
      
      // Add category filters
      if (entry.filters.category && entry.filters.category.length > 0) {
        entry.filters.category.forEach(category => {
          filterEntries.push({
            entry_id: entry.id,
            filter_type: 'category',
            filter_value: category
          });
        });
      }
      
      // Add server filters
      if (entry.filters.server && entry.filters.server.length > 0) {
        entry.filters.server.forEach(server => {
          filterEntries.push({
            entry_id: entry.id,
            filter_type: 'server',
            filter_value: server
          });
        });
      }
      
      if (filterEntries.length > 0) {
        const { error: filterError } = await supabase
          .from('entry_filters')
          .insert(filterEntries);
          
        if (filterError) {
          console.error('Error inserting filters:', filterError);
          throw filterError;
        }
      }
    }
    
    // Insert links
    if (entry.links && entry.links.length > 0) {
      const linkEntries = entry.links.map(link => ({
        entry_id: entry.id,
        link_text: link.linkText,
        href: link.href,
        extra_text: link.extraText,
        archive_href: link.archiveHref,
        archive_tweet_path: link.archiveTweetPath,
        archive_tweet_alt: link.archiveTweetAlt,
        archive_tweet_assets: link.archiveTweetAssets
      }));
      
      const { error: linkError } = await supabase
        .from('entry_links')
        .insert(linkEntries);
        
      if (linkError) {
        console.error('Error inserting links:', linkError);
        throw linkError;
      }
    }
    
    return entry.id;
  }
  
  // If no ID, create a new entry
  // Generate a key for this entry
  let idIncrementor = -1;
  let key;
  let exists = true;
  
  // Find the first available key for this date
  do {
    idIncrementor += 1;
    key = `${entry.date}-${idIncrementor}`;
    
    const { data, error } = await supabase
      .from('entries')
      .select('id')
      .eq('id', key)
      .limit(1);
      
    if (error) {
      console.error('Error checking if entry exists:', error);
      throw error;
    }
    
    exists = data && data.length > 0;
  } while (exists);
  
  entry.id = key;
  
  // Start a transaction
  const { data: entryData, error: entryError } = await supabase
    .from('entries')
    .insert({
      id: entry.id,
      title: entry.title,
      short_title: entry.shortTitle,
      readable_id: entry.readableId,
      date: entry.date,
      body: entry.body,
      faicon: entry.faicon,
      icon: entry.icon,
      image: entry.image,
      collection: entry.collection || [],
      starred: entry.starred || false
    });
    
  if (entryError) {
    console.error('Error inserting entry:', entryError);
    throw entryError;
  }
  
  // Insert filters
  if (entry.filters) {
    const filterEntries = [];
    
    // Add theme filters
    if (entry.filters.theme && entry.filters.theme.length > 0) {
      entry.filters.theme.forEach(theme => {
        filterEntries.push({
          entry_id: entry.id,
          filter_type: 'theme',
          filter_value: theme
        });
      });
    }
    
    // Add category filters
    if (entry.filters.category && entry.filters.category.length > 0) {
      entry.filters.category.forEach(category => {
        filterEntries.push({
          entry_id: entry.id,
          filter_type: 'category',
          filter_value: category
        });
      });
    }
    
    // Add server filters
    if (entry.filters.server && entry.filters.server.length > 0) {
      entry.filters.server.forEach(server => {
        filterEntries.push({
          entry_id: entry.id,
          filter_type: 'server',
          filter_value: server
        });
      });
    }
    
    if (filterEntries.length > 0) {
      const { error: filterError } = await supabase
        .from('entry_filters')
        .insert(filterEntries);
        
      if (filterError) {
        console.error('Error inserting filters:', filterError);
        throw filterError;
      }
    }
  }
  
  // Insert links
  if (entry.links && entry.links.length > 0) {
    const linkEntries = entry.links.map(link => ({
      entry_id: entry.id,
      link_text: link.linkText,
      href: link.href,
      extra_text: link.extraText,
      archive_href: link.archiveHref,
      archive_tweet_path: link.archiveTweetPath,
      archive_tweet_alt: link.archiveTweetAlt,
      archive_tweet_assets: link.archiveTweetAssets
    }));
    
    const { error: linkError } = await supabase
      .from('entry_links')
      .insert(linkEntries);
      
    if (linkError) {
      console.error('Error inserting links:', linkError);
      throw linkError;
    }
  }
  
  return entry.id;
};

// Delete an entry and all related data
export const deleteEntry = async (entryId) => {
  if (!entryId) {
    throw new Error('Entry ID is required for deletion');
  }
  
  // Start a transaction to delete everything related to this entry
  
  // 1. Delete entry links
  const { error: linksError } = await supabase
    .from('entry_links')
    .delete()
    .eq('entry_id', entryId);
    
  if (linksError) {
    console.error('Error deleting entry links:', linksError);
    throw linksError;
  }
  
  // 2. Delete entry filters
  const { error: filtersError } = await supabase
    .from('entry_filters')
    .delete()
    .eq('entry_id', entryId);
    
  if (filtersError) {
    console.error('Error deleting entry filters:', filtersError);
    throw filtersError;
  }
  
  // 3. Delete the entry itself
  const { error: entryError } = await supabase
    .from('entries')
    .delete()
    .eq('id', entryId);
    
  if (entryError) {
    console.error('Error deleting entry:', entryError);
    throw entryError;
  }
  
  return true;
};

// Add attribution (common function for both image and entry attributions)
export const addAttribution = (field) => async (entry) => {
  // First get existing attributions
  const { data, error } = await supabase
    .from('attributions')
    .select('*')
    .eq('type', field)
    .order('sort_key', { ascending: true });
    
  if (error) {
    console.error(`Error fetching ${field} attributions:`, error);
    throw error;
  }
  
  // Calculate sort key for insertion
  const sortKey = entry.sortKey || stripHtml(entry.text);
  
  // Insert the new attribution
  const { error: insertError } = await supabase
    .from('attributions')
    .insert({
      type: field,
      text: entry.text,
      href: entry.href,
      sort_key: sortKey
    });
    
  if (insertError) {
    console.error(`Error inserting ${field} attribution:`, insertError);
    throw insertError;
  }
};

export const addImageAttribution = addAttribution('images');
export const addEntryAttribution = addAttribution('entries');
