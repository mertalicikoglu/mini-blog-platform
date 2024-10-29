import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Comments from './Comments';

interface Post {
  id: string;
  title: string;
  content: string;
}

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        // Backend'den gönderi detaylarını çek
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      setCommentContent('');
      setCommentError(null);
    } catch (error) {
      setCommentError((error as Error).message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {post && (
        <div>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      )}
      <div>
        <h3>Add a Comment</h3>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Write your comment here..."
        />
        <button onClick={handleAddComment}>Add Comment</button>
        {commentError && <div style={{ color: 'red' }}>{commentError}</div>}
      </div>
      <Comments postId={postId as string} />
    </div>
  );
};

export default PostDetail;
