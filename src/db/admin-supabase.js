import { supabase } from './supabase';
import { stripHtml } from '../js/utilities';

// Upload a new entry
export const uploadEntry = async (entry) => {
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
      scam_amount_details: entry.scamAmountDetails,
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
    
    // Add tech filters
    if (entry.filters.tech && entry.filters.tech.length > 0) {
      entry.filters.tech.forEach(tech => {
        filterEntries.push({
          entry_id: entry.id,
          filter_type: 'tech',
          filter_value: tech
        });
      });
    }
    
    // Add blockchain filters
    if (entry.filters.blockchain && entry.filters.blockchain.length > 0) {
      entry.filters.blockchain.forEach(blockchain => {
        filterEntries.push({
          entry_id: entry.id,
          filter_type: 'blockchain',
          filter_value: blockchain
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
