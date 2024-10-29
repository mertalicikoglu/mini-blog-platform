import React, { useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { supabase } from '../auth/supabaseClient';
interface Post {
  id: number;
  title: string;
  content: string;
}

const fetchPosts = async (page: number, query: string) => {
  const limit = 10; // Sayfa başına gönderi sayısı
  let request = supabase.from('posts').select('*').order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1);

  if (query) {
    request = request.ilike('title', `%${query}%`);
  }

  const { data, error } = await request;
  if (error) throw new Error(error.message);
  return data;
};

const Posts: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // React Query kullanarak verileri sorgula
  const { data: posts, error, isLoading, isFetching }: UseQueryResult<Post[], Error> = useQuery(['posts', page, searchQuery], () => fetchPosts(page, searchQuery), {
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Posts</h2>
      <input
        type="text"
        placeholder="Search posts"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(1); // Arama yapıldığında sayfayı 1'e resetle
        }}
      />
      {isFetching && <div>Fetching data...</div>}
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
      <div>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span> Page {page} </span>
        <button onClick={() => setPage((prev) => prev + 1)} disabled={posts && posts.length < 10}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Posts;
