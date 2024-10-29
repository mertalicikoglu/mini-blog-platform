import { supabase } from './supabaseClient';

// Kullanıcı kaydolma
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw error;
  }
  const user = data.user;
  return { user };
};

// Kullanıcı giriş yapma
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
  const user = data.user;
  return { user };
};

// Kullanıcı çıkış yapma
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};
