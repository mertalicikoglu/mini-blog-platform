import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { supabase } from '../auth/supabaseClient';
import { postSchema } from '../utils/validation';
import { z } from 'zod';

const createPost = async (newPost: { title: string; content: string }) => {
  const { data, error } = await supabase.from('posts').insert(newPost).single();
  if (error) throw new Error(error.message);
  return data;
};

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null); // Kullanıcı mesajları için durum
  const queryClient = useQueryClient();

  const mutation = useMutation(createPost, {
    onSuccess: () => {
      // Yeni post eklendiğinde post listesini güncelle
      queryClient.invalidateQueries('posts');
      setTitle('');
      setContent('');
      setMessage('Post created successfully!');
    },
    onError: (error: any) => {
      setMessage('Failed to create post: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Veriyi Zod ile doğrula
      const validatedData = postSchema.parse({ title, content });
      mutation.mutate(validatedData);
      setErrors([]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors.map((err) => err.message));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Submitting...' : 'Submit'}
      </button>
      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      {message && <div style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</div>}
    </form>
  );
};

export default CreatePost;
