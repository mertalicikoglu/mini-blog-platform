import { render, screen, waitFor } from '@testing-library/react';
import { supabase } from '../../auth/supabaseClient';
import Posts from '../Posts';

jest.mock('../../auth/supabaseClient', () => {
  return {
    supabase: {
      from: jest.fn(() => ({
        select: jest.fn(),
        eq: jest.fn(),
        on: jest.fn(),
        subscribe: jest.fn(),
      })),
      channel: jest.fn(() => ({
        on: jest.fn(),
        subscribe: jest.fn(),
        removeChannel: jest.fn(),
      })),
    },
  };
});

describe('Posts Component', () => {
  const mockPosts = [
    { id: '1', title: 'Test Post 1', content: 'This is the first test post', user_id: '123', created_at: '2024-10-28' },
    { id: '2', title: 'Test Post 2', content: 'This is the second test post', user_id: '123', created_at: '2024-10-28' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render posts correctly', async () => {
    (supabase.from('posts').select as jest.Mock).mockResolvedValueOnce({
      data: mockPosts,
      error: null,
    });

    render(<Posts />);

    // Check that posts are loaded correctly
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });
  });

  it('should add a new post when a new post is inserted', async () => {
    // Mock existing posts first
    (supabase.from('posts').select as jest.Mock).mockResolvedValueOnce({
      data: mockPosts,
      error: null,
    });

    render(<Posts />);

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });

    // Simulate real-time insertion of a new post
    const newPost = { id: '3', title: 'New Test Post', content: 'This is a new test post', user_id: '456', created_at: '2024-10-28' };
    const subscriptionCallback = (supabase.channel as jest.Mock).mock.calls[0][1].on.mock.calls[0][2];
    subscriptionCallback({ eventType: 'INSERT', new: newPost });

    // Check that the new post is displayed
    await waitFor(() => {
      expect(screen.getByText('New Test Post')).toBeInTheDocument();
    });
  });

  it('should remove a post when a post is deleted', async () => {
    // Mock existing posts
    (supabase.from('posts').select as jest.Mock).mockResolvedValueOnce({
      data: mockPosts,
      error: null,
    });

    render(<Posts />);

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });

    // Simulate real-time deletion of a post
    const deletedPost = { id: '1' };
    const subscriptionCallback = (supabase.channel as jest.Mock).mock.calls[0][1].on.mock.calls[0][2];
    subscriptionCallback({ eventType: 'DELETE', old: deletedPost });

    // Check that the deleted post is no longer displayed
    await waitFor(() => {
      expect(screen.queryByText('Test Post 1')).not.toBeInTheDocument();
    });
  });
});