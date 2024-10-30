// src/models/commentModel.ts

import { supabase } from '../auth/supabaseClient';

export interface Comment {
  id: string;
  post_id: string;
  content: string;
  user_id: string;
  created_at: string;
}

// Fetch all comments for a specific post
export const getCommentsByPostId = async (id: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', id);

  if (error) {
    throw new Error(error.message);
  }

  return data as Comment[]; // Can return multiple rows
};

export const getCommentById = async (id: string): Promise<Comment | null> => {
  const { data, error } = await supabase.from('comments').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data || null;
}

// Create a new comment
export const createComment = async (comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> => {
  // Insert the new comment
  const { data: insertData, error: insertError } = await supabase.from('comments').insert(comment).select().single();

  if (insertError) {
    console.error('Error inserting comment:', insertError);
    throw new Error(insertError.message);
  }

  // If `insertData` is null, query the data again
  if (!insertData) {
    const { data: queryData, error: queryError } = await supabase
      .from('comments')
      .select('*')
      .eq('content', comment.content) // Use an appropriate filter to identify the inserted comment
      .single();

    if (queryError) {
      console.error('Error querying the inserted comment:', queryError);
      throw new Error(queryError.message);
    }

    return queryData!;
  }

  return insertData;
};

// Update a specific comment
export const updateComment = async (id: string, comment: Partial<Comment>): Promise<Comment> => {
  const { data: updatedData, error: insertError } = await supabase.from('comments').update(comment).eq('id', id).select().single();
  if (insertError) throw new Error(insertError.message);
  return updatedData!;
};

// Delete a specific comment
export const deleteComment = async (id: string): Promise<void> => {
  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// Fetch comments by a specific user
export const getUserComments = async (userId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data || [];
};