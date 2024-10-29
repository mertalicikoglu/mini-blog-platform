// src/components/Comments.tsx

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

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('postId', postId);

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data || []);
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

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
