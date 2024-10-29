import { createPost, getAllPosts, getPostById, updatePost, deletePost } from '../src/models/postModel';
import { supabase } from '../src/auth/supabaseClient';
import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../src/auth/supabaseClient', () => {
  return {
    supabase: {
      from: jest.fn((relation: string) => ({
        insert: jest.fn(),
        select: jest.fn(),
        eq: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        order: jest.fn(),
        range: jest.fn(),
      })),
    },
  };
});

describe('Post Model', () => {
  it('should create a post', async () => {
    const mockPost = { title: 'Test Title', content: 'Test Content', user_id: '123' };

    const mockResponse = {
      data: mockPost,
      error: null,
      status: 201,
      statusText: 'Created',
    };

    // @ts-ignore: TypeScript tür denetimini atlamak için bu satırı ekliyoruz
    (supabase.from('posts').insert as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await createPost(mockPost);

    expect(result).toEqual(mockPost);
    expect(supabase.from).toHaveBeenCalledWith('posts');
    expect(supabase.from('posts').insert).toHaveBeenCalledWith(mockPost);
  });

  it('should get posts with pagination', async () => {
    const mockPosts = [
      { id: '1', title: 'Test Title 1', content: 'Test Content 1', user_id: '123', created_at: '2024-10-28' },
      { id: '2', title: 'Test Title 2', content: 'Test Content 2', user_id: '123', created_at: '2024-10-28' },
    ];

    const mockResponse = {
      data: mockPosts,
      error: null,
      status: 200,
      statusText: 'OK',
    };

    // @ts-ignore: TypeScript tür denetimini atlamak için bu satırı ekliyoruz
    (supabase.from('posts').select as jest.Mock).mockReturnValueOnce({order: jest.fn().mockReturnValueOnce({range: jest.fn().mockResolvedValueOnce(mockResponse),}),
    });

    const result = await getAllPosts(1, 10);

    expect(result).toEqual(mockPosts);
    expect(supabase.from).toHaveBeenCalledWith('posts');
  });

  it('should get post by id', async () => {
    const mockPost = { id: '1', title: 'Test Title', content: 'Test Content', user_id: '123', created_at: '2024-10-28' };

    const mockResponse = {
      data: mockPost,
      error: null,
      status: 200,
      statusText: 'OK',
    };

    // @ts-ignore: TypeScript tür denetimini atlamak için bu satırı ekliyoruz
    (supabase.from('posts').select as jest.Mock).mockReturnValueOnce({eq: jest.fn().mockResolvedValueOnce(mockResponse)});

    const result = await getPostById('1');

    expect(result).toEqual(mockPost);
    expect(supabase.from).toHaveBeenCalledWith('posts');
    expect(supabase.from('posts').select().eq).toHaveBeenCalledWith('id', '1');
  });
});