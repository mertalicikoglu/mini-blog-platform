import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { supabase } from '../auth/supabaseClient';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Comment {
  id: string;
  postId: string;
  content: string;
  created_at: string;
}

const UserContent: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchUserContent = async () => {
      if (user) {
        const postsResponse = await supabase
          .from('posts') // Tablo adı string olarak belirtiliyor.
          .select('*') // Tüm alanları seçiyoruz.
          .eq('user_id', user.id);
  
        if (postsResponse.error) {
          console.error(postsResponse.error);
        } else {
          setPosts(postsResponse.data as Post[]); // Tip zorlaması kullanıyoruz.
        }
  
        const commentsResponse = await supabase
          .from('comments') // Tablo adı string olarak belirtiliyor.
          .select('*') // Tüm alanları seçiyoruz.
          .eq('user_id', user.id);
  
        if (commentsResponse.error) {
          console.error(commentsResponse.error);
        } else {
          setComments(commentsResponse.data as Comment[]); // Tip zorlaması kullanıyoruz.
        }
      }
    };
  
    fetchUserContent();
  }, [user]);
  
  

  return (
    <div>
      <h2>Your Posts</h2>
      {posts.length === 0 ? (
        <p>You have no posts.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>Created at: {post.created_at}</p>
            {/* Buraya güncelleme ve silme butonları ekleyebiliriz */}
          </div>
        ))
      )}

      <h2>Your Comments</h2>
      {comments.length === 0 ? (
        <p>You have no comments.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id}>
            <p>Comment: {comment.content}</p>
            <p>Created at: {comment.created_at}</p>
            {/* Buraya güncelleme ve silme butonları ekleyebiliriz */}
          </div>
        ))
      )}
    </div>
  );
};

export default UserContent;
