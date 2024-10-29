import React, { useState } from 'react';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
});

interface PostFormProps {
  onSubmit: (data: { title: string; content: string }) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Gelen verileri doğrula
      const validatedData = postSchema.parse({ title, content });
      setErrors([]);
      onSubmit(validatedData);
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
      <button type="submit">Submit</button>
      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </form>
  );
};

export default PostForm;
