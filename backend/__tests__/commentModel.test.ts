import { createComment, getCommentsByPostId, updateComment, deleteComment } from '../src/models/commentModel';
import { supabase } from '../src/auth/supabaseClient';
import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../src/auth/supabaseClient', () => {
  return {
    supabase: {
      from: jest.fn(() => ({
        insert: jest.fn(),
        select: jest.fn(),
        eq: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        order: jest.fn(),
      })),
    },
  };
});

describe('commentModel', () => {
  it('should create a comment', async () => {
    const mockComment = { postId: '1', content: 'Test Comment', user_id: '123' };

    const mockResponse = {
      data: mockComment,
      error: null,
      status: 201,
      statusText: 'Created',
    };

    // @ts-ignore: TypeScript tür denetimini atlamak için bu satırı ekliyoruz
    (supabase.from('comments').insert as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await createComment(mockComment);

    expect(result).toEqual(mockComment);
    expect(supabase.from).toHaveBeenCalledWith('comments');
    expect(supabase.from('comments').insert).toHaveBeenCalledWith(mockComment);
  });

  it('should get comments by post id', async () => {
    const mockComments = [
      { id: '1', postId: '1', content: 'Test Comment 1', user_id: '123', created_at: '2024-10-28' },
      { id: '2', postId: '1', content: 'Test Comment 2', user_id: '123', created_at: '2024-10-28' },
    ];

    const mockResponse = {
      data: mockComments,
      error: null,
      status: 200,
      statusText: 'OK',
    };

    // @ts-ignore: TypeScript tür denetimini atlamak için bu satırı ekliyoruz
    (supabase.from('comments').select as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await getCommentsByPostId('1');

    expect(result).toEqual(mockComments);
    expect(supabase.from).toHaveBeenCalledWith('comments');
    expect(supabase.from('comments').select).toHaveBeenCalled();
    expect(supabase.from('comments').select().eq).toHaveBeenCalledWith('postId', '1');
  });

  it('should update a comment', async () => {
    const mockUpdatedComment = { content: 'Updated Comment' };
    const commentId = '1';

    const mockResponse = {
      data: mockUpdatedComment,
      error: null,
      status: 200,
      statusText: 'OK',
    };

    // @ts-ignore: TypeScript tür denetimini atlamak için bu satırı ekliyoruz
    (supabase.from('comments').update as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await updateComment(commentId, mockUpdatedComment);

    expect(result).toEqual(mockUpdatedComment);
    expect(supabase.from).toHaveBeenCalledWith('comments');
    expect(supabase.from('comments').update).toHaveBeenCalledWith(mockUpdatedComment);
    expect(supabase.from('comments').update(mockUpdatedComment).eq).toHaveBeenCalledWith('id', commentId);
  });

  it('should delete a comment', async () => {
    const commentId = '1';

    const mockResponse = {
      data: null,
      error: null,
      status: 200,
      statusText: 'OK',
    };

    // @ts-ignore: TypeScript tür denetimini atlamak için bu satırı ekliyoruz
    (supabase.from('comments').delete as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await deleteComment(commentId);

    expect(result).toEqual(null);
    expect(supabase.from).toHaveBeenCalledWith('comments');
    expect(supabase.from('comments').delete).toHaveBeenCalled();
    expect(supabase.from('comments').delete().eq).toHaveBeenCalledWith('id', commentId);
  });
});