import { Request, Response, NextFunction } from 'express';
import * as userModel from '../models/userModel';
import * as postModel from '../models/postModel';
import * as commentModel from '../models/commentModel';
import { z } from 'zod';
import { NotFoundError, UnauthorizedError } from '../errors/AppError';

// Get user profile
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user!; // req.user will be available due to requireAuth middleware
    const profile = await userModel.getUserProfile(id);
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction)  => {
  try {
    const { id } = req.user!;

    // Validate the request data
    const schema = z.object({
      username: z.string().optional(),
      bio: z.string().optional(),
    });
    const validatedData = schema.parse(req.body);

    const updatedProfile = await userModel.updateUserProfile(id, validatedData);
    if (!updatedProfile) {
      throw new NotFoundError('User profile not found');
    }
    res.json(updatedProfile);
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({ errors: error.errors });
       return
    }
    next(error);
  }
};

// Get user posts
export const getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user!; // req.user will be available due to requireAuth middleware
    const posts = await postModel.getUserPosts(id);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// Get user comments
export const getUserComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user!; // req.user will be available due to requireAuth middleware
    const comments = await commentModel.getUserComments(id);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};
