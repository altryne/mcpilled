import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with options for Cloudflare Workers
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client with Cloudflare Workers compatibility options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Don't persist session in Cloudflare Workers
    autoRefreshToken: false, // Don't auto refresh tokens in Cloudflare Workers
    detectSessionInUrl: false, // Don't detect session in URL in Cloudflare Workers
  },
  global: {
    // Use custom fetch implementation for Cloudflare Workers compatibility
    fetch: (...args) => {
      // Use the global fetch with the same arguments
      return fetch(...args);
    }
  }
});
