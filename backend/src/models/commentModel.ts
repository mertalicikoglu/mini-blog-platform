// src/models/commentModel.ts

import { supabase } from '../auth/supabaseClient';

export interface Comment {
    id: string;
    postId: string;
    content: string;
    user_id: string;
    created_at: string;
}

// Belirli bir gönderiye ait tüm yorumları getir
export const getCommentsByPostId = async (id: string): Promise<Comment | null> => {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw new Error(error.message);
    return data;
};

// Yeni bir yorum oluştur
export const createComment = async (comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> => {
    const { data, error } = await supabase.from('comments').insert([comment]).single();
    if (error) throw new Error(error.message);
    return data!;
};

// Belirli bir yorumu güncelle
export const updateComment = async (id: string, comment: Partial<Comment>): Promise<Comment> => {
    const { data, error } = await supabase.from('comments').update(comment).eq('id', id).single();
    if (error) throw new Error(error.message);
    return data!;
};

// Belirli bir yorumu sil
export const deleteComment = async (id: string): Promise<void> => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

// Kullanıcının yorumlarını getir
export const getUserComments = async (userId: string): Promise<Comment[]> => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('user_id', userId);
  
    if (error) throw new Error(error.message);
    return data || [];
  };
  
