// src/models/commentModel.ts

import { supabase } from '../auth/supabaseClient';

export interface Comment {
  id: string;
  post_id: string;
  content: string;
  user_id: string;
  created_at: string;
}

// Belirli bir gönderiye ait tüm yorumları getir
export const getCommentsByPostId = async (id: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', id);

  if (error) {
    throw new Error(error.message);
  }

  return data as Comment[]; // Birden fazla satır döndürebilir
};

export const getCommentById = async (id: string): Promise<Comment | null> => {
  const { data, error } = await supabase.from('comments').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data || null;
}

// Yeni bir yorum oluştur
export const createComment = async (comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> => {
  // Yeni yorumu ekleyin
  const { data: insertData, error: insertError } = await supabase.from('comments').insert(comment).select().single();

  if (insertError) {
    console.error('Error inserting comment:', insertError);
    throw new Error(insertError.message);
  }

  // Eğer `insertData` null ise, tekrar sorgulayarak veriyi getirin
  if (!insertData) {
    const { data: queryData, error: queryError } = await supabase
      .from('comments')
      .select('*')
      .eq('content', comment.content) // Eklenen yorumu tanımlamak için uygun bir filtre kullanın
      .single();

    if (queryError) {
      console.error('Error querying the inserted comment:', queryError);
      throw new Error(queryError.message);
    }

    return queryData!;
  }

  return insertData;
};


// Belirli bir yorumu güncelle
export const updateComment = async (id: string, comment: Partial<Comment>): Promise<Comment> => {
  const { data: updatedData, error: insertError } = await supabase.from('comments').update(comment).eq('id', id).select().single();
  if (insertError) throw new Error(insertError.message);
  return updatedData!;
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

