// src/models/postModel.ts

import { supabase } from '../auth/supabaseClient';

export interface Post {
    id: string;
    title: string;
    content: string;
    user_id: string;
    created_at: string;
}

// Fetch all posts
export const getAllPosts = async (page: number, limit: number): Promise<Post[]> => {
    const offset = (page - 1) * limit;
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
    if (error) throw new Error(error.message);
    return data || [];
};

export const getPosts = async (search: string | undefined, page: number, limit: number) => {
    let query = supabase.from('posts').select('*').order('created_at', { ascending: false });

    // If there is a search query, search in the title
    if (search && search.trim() !== '') {
        query = query.ilike('title', `%${search}%`);
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Fetch a specific post
export const getPostById = async (id: string): Promise<Post | null> => {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
};

// Create a new post
export const createPost = async (post: Omit<Post, 'id' | 'created_at'>): Promise<Post> => {
    const { data, error } = await supabase.from('posts').insert(post).single();
    if (error) throw new Error(error.message);
    return data;
};

// Update a specific post
export const updatePost = async (id: string, post: Partial<Post>): Promise<Post> => {
    const { data, error } = await supabase.from('posts').update(post).eq('id', id).single();
    if (error) throw new Error(error.message);
    return data!;
};

// Delete a specific post
export const deletePost = async (id: string): Promise<void> => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

export const searchPosts = async (searchTerm: string): Promise<Post[]> => {
    const { data, error } = await supabase.from('posts').select('*').textSearch('title', searchTerm);
    if (error) throw new Error(error.message);
    return data || [];
}

// Fetch posts by a specific user
export const getUserPosts = async (userId: string): Promise<Post[]> => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data || [];
};