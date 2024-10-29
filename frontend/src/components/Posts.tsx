import React, { useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { z } from 'zod';
import { Link } from 'react-router-dom'; // Link bileşenini ekliyoruz

interface Post {
  id: number;
  title: string;
  content: string;
}

const fetchPosts = async (page: number, query: string) => {
  const limit = 10; // Sayfa başına gönderi sayısı
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

  // Zod doğrulama şeması
  const searchQuerySchema = z.string().min(1, 'Search query must be at least 1 character').max(50, 'Search query must be less than 50 characters');

  // React Query kullanarak verileri sorgula
  const { data: posts, error, isLoading, isFetching }: UseQueryResult<Post[], Error> = useQuery(['posts', page, searchQuery], () => fetchPosts(page, searchQuery), {
    keepPreviousData: true,
    enabled: !formError, // Form hatası olduğunda sorgulamayı engelle
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
      setPage(1); // Arama yapıldığında sayfayı 1'e resetle
    }
  };

  return (
    <div>
      <h2>Posts</h2>
      <input
        type="text"
        placeholder="Search posts"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {formError && <div style={{ color: 'red' }}>{formError}</div>}
      {isFetching && <div>Fetching data...</div>}
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <h3>
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </h3>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}> Page {page} </span>
        <button onClick={() => setPage((prev) => (posts && posts.length === 10 ? prev + 1 : prev))} disabled={posts && posts.length < 10}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Posts;
