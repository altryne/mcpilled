require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  try {
    // Try to fetch a single entry
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .limit(10);
    
    if (error) {
      console.error('Error fetching from Supabase:', error);
      return;
    }
    
    console.log('Successfully fetched data:', data);
    
    // Try the full query we use in the app
    const { data: fullData, error: fullError } = await supabase
      .from('entries')
      .select(`
        *,
        entry_filters(filter_type, filter_value),
        entry_links(*)
      `)
      .limit(1);
    
    if (fullError) {
      console.error('Error with full query:', fullError);
      return;
    }
    
    console.log('Full query data:', JSON.stringify(fullData, null, 2));
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testFetch();
