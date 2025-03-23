import { supabase } from '../db/supabase';

// Sign in with email and password
export const signIn = async (password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'altryne@gmail.com', // Replace with your admin email
    password: password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('INVALID_PASSWORD');
    }
    throw error;
  }

  return data;
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

// Get current session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
};

// Set up auth state change listener
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
};
