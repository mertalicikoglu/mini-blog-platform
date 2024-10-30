// src/controllers/commentController.ts

import { Request, Response, NextFunction } from 'express';
import * as commentModel from '../models/commentModel';
import { commentSchema } from '../utils/validate';
import { NotFoundError, UnauthorizedError } from '../errors/AppError';
import { z } from 'zod';
interface CustomRequest extends Request {
  postId?: string;
}

// Get all comments for a specific post
export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId  = (req as CustomRequest).postId;
    if (!postId) {
      throw new NotFoundError('Post ID is required');
    }
    const comments = await commentModel.getCommentsByPostId(postId);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};


// Add a new comment
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post_id  = (req as CustomRequest).postId;
    // Validate the request data
    const validatedData = commentSchema.parse({ ...req.body, post_id });

    // Add user ID to the comment data
    const commentData = {
      ...validatedData,
      user_id: req.user!.id, // req.user will be available due to requireAuth middleware, hence the "!".
    };

    const newComment = await commentModel.createComment(commentData);
    res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({ errors: error.errors });
       return
    }
    next(error);
  }
};



// Update an existing comment
export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    // Doğrulama
    const validatedData = commentSchema.partial().parse(req.body);
    const comment = await commentModel.getCommentById(commentId);
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }
    if (comment.user_id !== req.user!.id) {
      throw new UnauthorizedError('You are not authorized to update this comment');
    }
    const updatedComment = await commentModel.updateComment(commentId, validatedData);
    res.json(updatedComment);
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({ errors: error.errors });
       return
    }
    next(error);
  }
};


// Delete a comment
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const comment = await commentModel.getCommentById(commentId);
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }
    if (comment.user_id !== req.user!.id) {
      throw new UnauthorizedError('You are not authorized to delete this comment');
    }
    await commentModel.deleteComment(commentId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

