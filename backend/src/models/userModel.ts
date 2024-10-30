import { supabase } from '../auth/supabaseClient';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  role: 'user' | 'admin';
}

// Fetch user profile
export const getUserProfile = async (id: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Update user profile
export const updateUserProfile = async (id: string, updatedData: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('users')
    .update(updatedData)
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};