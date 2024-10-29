import React, { useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { supabase } from '../auth/supabaseClient';
interface Post {
    id: number;
    title: string;
    content: string;
}
const fetchPosts = async (page: number) => {
    const limit = 10; // Sayfa başına gönderi sayısı
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

    if (error) throw new Error(error.message);
    return data;
};

const Posts: React.FC = () => {
    const [page, setPage] = useState(1);
    const { data: posts, error, isLoading }: UseQueryResult<Post[], Error> = useQuery(['posts', page], () => fetchPosts(page), {
        keepPreviousData: true,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>Posts</h2>
            {posts && posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}
            <div>
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                    Previous
                </button>
                <span> Page {page} </span>
                <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
            </div>
        </div>
    );
};

export default Posts;
