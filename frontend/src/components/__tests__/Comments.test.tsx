import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { supabase } from '../../auth/supabaseClient';
import Comments from '../Comments';

jest.mock('../../auth/supabaseClient', () => {
  return {
    supabase: {
      from: jest.fn(() => ({
        select: jest.fn(),
        eq: jest.fn(),
      })),
      channel: jest.fn((name: string) => ({
        on: jest.fn(),
        subscribe: jest.fn(),
        removeChannel: jest.fn(),
      })),
    },
  };
});

describe('Comments Component', () => {
  const mockPostId = '1';
  const mockComments = [
    { id: '1', postId: mockPostId, content: 'Test Comment 1', user_id: '123', created_at: '2024-10-28' },
    { id: '2', postId: mockPostId, content: 'Test Comment 2', user_id: '123', created_at: '2024-10-28' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render comments correctly', async () => {
    (supabase.from('comments').select as jest.Mock).mockResolvedValueOnce({
      data: mockComments,
      error: null,
    });

    render(<Comments postId={mockPostId} />);

    // Check that comments are loaded correctly
    await waitFor(() => {
      expect(screen.getByText('Test Comment 1')).toBeInTheDocument();
      expect(screen.getByText('Test Comment 2')).toBeInTheDocument();
    });
  });

  it('should add a new comment when a new comment is inserted', async () => {
    // Mock existing comments first
    (supabase.from('comments').select as jest.Mock).mockResolvedValueOnce({
      data: mockComments,
      error: null,
    });
  
    render(<Comments postId={mockPostId} />);
  
    await waitFor(() => {
      expect(screen.getByText('Test Comment 1')).toBeInTheDocument();
      expect(screen.getByText('Test Comment 2')).toBeInTheDocument();
    });
  
    // Simulate real-time insertion of a new comment
    const newComment = { id: '3', postId: mockPostId, content: 'New Test Comment', user_id: '456', created_at: '2024-10-28' };
  
    // Call the subscription callback with the new comment
    const subscriptionCallback = (supabase.channel as jest.Mock).mock.calls[0][1].on.mock.calls[0][2];
    subscriptionCallback({ eventType: 'INSERT', new: newComment });
  
    // Check that the new comment is displayed
    await waitFor(() => {
      expect(screen.getByText('New Test Comment')).toBeInTheDocument();
    });
  });

  it('should remove a comment when a comment is deleted', async () => {
    // Mock existing comments
    (supabase.from('comments').select as jest.Mock).mockResolvedValueOnce({
      data: mockComments,
      error: null,
    });

    render(<Comments postId={mockPostId} />);

    await waitFor(() => {
      expect(screen.getByText('Test Comment 1')).toBeInTheDocument();
      expect(screen.getByText('Test Comment 2')).toBeInTheDocument();
    });

    // Simulate real-time deletion of a comment
    const deletedComment = { id: '1' };
    const subscriptionCallback = (supabase.channel as jest.Mock).mock.calls[0][1].on.mock.calls[0][2];
    subscriptionCallback({ eventType: 'DELETE', old: deletedComment });

    // Check that the deleted comment is no longer displayed
    await waitFor(() => {
      expect(screen.queryByText('Test Comment 1')).not.toBeInTheDocument();
    });
  });
});