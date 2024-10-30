import React, { useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Post {
  id: number;
  title: string;
  content: string;
}

const fetchPosts = async (page: number, query: string) => {
  const limit = 10; // Number of posts per page
  let url = `${import.meta.env.VITE_BACKEND_URL}/api/posts?page=${page}&limit=${limit}`;

  if (query) {
    url += `&search=${encodeURIComponent(query)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return await response.json();
};

const Posts: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verification schema for search query
  const searchQuerySchema = z.string().min(1, 'Search query must be at least 1 character').max(50, 'Search query must be less than 50 characters');

  // Using react-query to fetch posts
  const { data: posts, error, isLoading, isFetching }: UseQueryResult<Post[], Error> = useQuery(['posts', page, searchQuery], () => fetchPosts(page, searchQuery), {
    keepPreviousData: true,
    enabled: !formError, // Disable the query when there is a form error
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Doğrulama
    const result = searchQuerySchema.safeParse(value);
    if (!result.success) {
      setFormError(result.error.errors[0].message);
    } else {
      setFormError(null);
      setPage(1); // When the search query changes, reset the page to 1
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-end">
        <div className="col-auto">
          <Link to="/signin" className="btn btn-primary me-2">SignIn</Link>
          <Link to="/signup" className="btn btn-primary">SignUp</Link>
        </div>

      </div>
      <div className="row justify-content-center">
        <div className="col-12 text-center mb-5">
          <h1 className="display-4 text-primary">Welcome to the Blog</h1>
          <p className="lead text-secondary">Explore the latest posts and share your thoughts!</p>
        </div>
      </div>
      <div className="row mb-4 justify-content-center align-items-center">
        <div className="col-12 col-md-5">
          <input
            type="text"
            className="form-control border-primary shadow-sm"
            placeholder="Search posts"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {formError && <div className="text-danger mt-2 text-center">{formError}</div>}
        </div>
        <div className="col-auto">
          <button className="btn btn-success" onClick={() => navigate('/create-post')}>Create New Post</button>
        </div>
      </div>
      <div className="row justify-content-center">
        {isFetching && <div className="col-12 text-center">Fetching data...</div>}
        {posts && posts.length > 0 ? (
          <div className="col-12 col-md-8">
            <ul className="list-group">
              {posts.map((post) => (
                <li key={post.id} className="list-group-item mb-3 p-4 shadow-sm bg-light rounded">
                  <div className="d-flex justify-content-center align-items-start">
                    <div>
                      <h5 className="mb-1">
                        <Link to={`/post/${post.id}`} className="text-decoration-none text-primary">
                          {post.title}
                        </Link>
                      </h5>
                      <p className="mb-1 text-muted">{post.content.substring(0, 100)}...</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="col-12 text-center">
            <p>No posts found.</p>
          </div>
        )}
      </div>
      <div className="row mt-4">
        <div className="col-12 d-flex justify-content-center">
          <button className="btn btn-primary me-2" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
            Previous
          </button>
          <span className="align-self-center"> Page {page} </span>
          <button className="btn btn-primary ms-2" onClick={() => setPage((prev) => (posts && posts.length === 10 ? prev + 1 : prev))} disabled={posts && posts.length < 10}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Posts;
