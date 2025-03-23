import { supabase } from './supabase';

// Get attributions by type
export const getAttributions = async (type) => {
  const { data, error } = await supabase
    .from('attributions')
    .select('*')
    .eq('type', type)
    .order('sort_key', { ascending: true });
    
  if (error) {
    console.error(`Error fetching ${type} attributions:`, error);
    throw error;
  }
  
  return data || [];
};

// Get image attributions
export const getImageAttributions = async () => {
  return getAttributions('images');
};

// Get entry attributions
export const getEntryAttributions = async () => {
  return getAttributions('entries');
};
