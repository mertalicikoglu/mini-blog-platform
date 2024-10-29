import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { supabase } from '../auth/supabaseClient';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const deletePost = async (postId: string) => {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw new Error(error.message);
};

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null); // Kullanıcı mesajları için durum

  const mutation = useMutation(() => deletePost(post.id), {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      setMessage('Post deleted successfully!');
    },
    onError: (error: any) => {
      setMessage('Failed to delete post: ' + error.message);
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      mutation.mutate();
    }
  };

  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <button onClick={handleDelete} disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Deleting...' : 'Delete'}
      </button>
      {message && <div style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
};

export default PostCard;
