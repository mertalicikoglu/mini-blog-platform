import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { postSchema } from '../utils/validation';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const createPost = async (newPost: { title: string; content: string; user_id: string }, token: string) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Kullanıcı token bilgisi burada ekleniyor
    },
    body: JSON.stringify(newPost),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return await response.json();
};

const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(
    async (newPost: { title: string; content: string; user_id: string }) => {
      if (!user || !user.access_token) {
        throw new Error('User is not authenticated');
      }
      return createPost(newPost, user.access_token);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts');
        setTitle('');
        setContent('');
        setMessage('Post created successfully!');
        navigate('/'); 
      },
      onError: (error: any) => {
        setMessage('Failed to create post: ' + error.message);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrors(['You must be logged in to create a post.']);
      return;
    }
    try {
      // Verify the data before sending it to the server
      const validatedData = postSchema.parse({ title, content });
      const postData = { ...validatedData, user_id: user.id };
      mutation.mutate(postData);
      setErrors([]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors.map((err) => err.message));
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm w-100" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Create Post</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">Content</label>
              <textarea
                className="form-control"
                id="content"
                placeholder="Enter post content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Submitting...' : 'Submit'}
            </button>
            {errors.length > 0 && (
              <div className="text-danger mt-3">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            {message && (
              <div className={`mt-3 text-center ${message.includes('successfully') ? 'text-success' : 'text-danger'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
