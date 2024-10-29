import React, { useEffect, useState } from 'react';
import { supabase } from '../auth/supabaseClient';

interface Comment {
  id: string;
  postId: string;
  content: string;
  created_at: string;
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  // Yorumları getir
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('postId', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data || []);
      }
    };

    fetchComments();

    // Realtime yorum dinleyicisi ekle
    const commentsSubscription = supabase
      .channel('comments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, (payload) => {
        if (payload.new.postId === postId) {
          setComments((prevComments) => [...prevComments, payload.new]);
        }
      })
      .subscribe();

    // Abonelikleri temizleme
    return () => {
      supabase.removeChannel(commentsSubscription);
    };
  }, [postId]);

  return (
    <div>
      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id}>
            <p>{comment.content}</p>
            <small>{new Date(comment.created_at).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
