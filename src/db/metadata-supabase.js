import { supabase } from './supabase';

// Get metadata including collections
export const getMetadata = async () => {
  // For collections, we'll query the entries table to get unique collection values
  const { data: entriesData, error: entriesError } = await supabase
    .from('entries')
    .select('collection');
    
  if (entriesError) {
    console.error('Error fetching collections:', entriesError);
    return { collections: [] };
  }
  
  // Extract unique collections from the entries
  const collections = [];
  if (entriesData) {
    entriesData.forEach(entry => {
      if (entry.collection && Array.isArray(entry.collection)) {
        entry.collection.forEach(collection => {
          if (!collections.includes(collection)) {
            collections.push(collection);
          }
        });
      }
    });
  }
  
  return { collections };
};
