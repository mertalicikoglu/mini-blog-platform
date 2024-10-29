import React, { useEffect, useState } from 'react';
import { supabase } from '../auth/supabaseClient';

interface Comment {
  id: string;
  postId: string;
  content: string;
  user_id: string;
  created_at: string;
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/comments`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();

    // Realtime subscription ekleyelim
    const commentChannel = supabase
      .channel('realtime-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `postId=eq.${postId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments((prevComments) => [...prevComments, payload.new as Comment]);
          } else if (payload.eventType === 'UPDATE') {
            setComments((prevComments) =>
              prevComments.map((comment) =>
                comment.id === (payload.new as Comment).id ? (payload.new as Comment) : comment
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setComments((prevComments) =>
              prevComments.filter((comment) => comment.id !== (payload.old as Comment).id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment, postId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      setComments((prevComments) => [...prevComments, data]);
      setNewComment('');
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleUpdateComment = async (commentId: string, updatedContent: string) => {
    if (!updatedContent.trim()) {
      setError('Updated comment cannot be empty');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: updatedContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      const data = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) => (comment.id === commentId ? data : comment))
      );
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write your comment here..."
      />
      <button onClick={handleAddComment}>Add Comment</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.content}</p>
            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
            <button
              onClick={() => {
                const updatedContent = prompt('Edit your comment:', comment.content);
                if (updatedContent !== null) {
                  handleUpdateComment(comment.id, updatedContent);
                }
              }}
            >
              Edit
            </button>
            <small>Posted by User {comment.user_id} on {new Date(comment.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
