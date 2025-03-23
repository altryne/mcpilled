import { supabase } from './supabase';

// Get glossary entries
export const getGlossaryEntries = async () => {
  // In Supabase, we'll store glossary entries in a separate table
  // For now, we'll return an empty array since we haven't created this table yet
  // You can implement this later based on your specific needs
  
  // Example implementation once you have a glossary table:
  /*
  const { data, error } = await supabase
    .from('glossary')
    .select('*')
    .order('term', { ascending: true });
    
  if (error) {
    console.error('Error fetching glossary entries:', error);
    return [];
  }
  
  return data || [];
  */
  
  return [];
};
