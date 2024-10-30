import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comments from './Comments';
import { useAuth } from '../auth/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        // Fetch post by ID
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

  const handleDeletePost = async () => {
    if (!post) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      navigate('/');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleEditPost = () => {
    if (!post) return;
    navigate(`/edit-post/${post.id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10">
          {post && (
            <div className="card shadow-sm mb-5">
              <div className="card-body">
                <h2 className="card-title text-primary text-center mb-4">{post.title}</h2>
                <p className="card-text text-muted text-justify">{post.content}</p>
                <p className="text-secondary text-end">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
                {user?.id === post.user_id && (
                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-outline-primary me-2" onClick={handleEditPost}>Edit</button>
                    <button className="btn btn-outline-danger" onClick={handleDeletePost}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          )}
          <Comments postId={postId!} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
