import { supabase } from '../auth/supabaseClient';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio?: string;
}

// Kullanıcı profili al
export const getUserProfile = async (id: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from<UserProfile>('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Kullanıcı profilini güncelle
export const updateUserProfile = async (id: string, updatedData: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from<UserProfile>('users')
    .update(updatedData)
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};