// src/models/postModel.ts

import { supabase } from '../auth/supabaseClient';

export interface Post {
    id: string;
    title: string;
    content: string;
    user_id: string;
    created_at: string;
}

// Tüm postları getir
export const getAllPosts = async (): Promise<Post[]> => {
    const { data, error } = await supabase.from('posts').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

// Belirli bir postu getir
export const getPostById = async (id: string): Promise<Post | null> => {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
};

// Yeni bir post oluştur
export const createPost = async (post: Omit<Post, 'id' | 'created_at'>): Promise<Post> => {
    const { data, error } = await supabase.from('posts').insert([post]).single();
    if (error) throw new Error(error.message);
    return data!;
};

// Belirli bir postu güncelle
export const updatePost = async (id: string, post: Partial<Post>): Promise<Post> => {
    const { data, error } = await supabase.from('posts').update(post).eq('id', id).single();
    if (error) throw new Error(error.message);
    return data!;
};

// Belirli bir postu sil
export const deletePost = async (id: string): Promise<void> => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

export const searchPosts = async (searchTerm: string): Promise<Post[]> => {
    const { data, error } = await supabase.from('posts').select('*').textSearch('title', searchTerm);
    if (error) throw new Error(error.message);
    return data || [];
}

export const getUserPosts = async (userId: string): Promise<Post[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId);
  
    if (error) throw new Error(error.message);
    return data || [];
  };
