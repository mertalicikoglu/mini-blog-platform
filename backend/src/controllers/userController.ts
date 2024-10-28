import { Request, Response, NextFunction } from 'express';
import * as userModel from '../models/userModel';
import * as postModel from '../models/postModel';
import * as commentModel from '../models/commentModel';
import { z } from 'zod';
import { NotFoundError, UnauthorizedError } from '../errors/AppError';

// Kullanıcı profilini getir
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user!; // requireAuth middleware ile kimlik doğrulaması yapıldığı için req.user mevcut olacak
    const profile = await userModel.getUserProfile(id);
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// Kullanıcı profilini güncelle
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction)  => {
  try {
    const { id } = req.user!; // requireAuth middleware ile kimlik doğrulaması yapıldığı için req.user mevcut olacak

    // Güncellenebilir alanları doğrulama
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

export const getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user!; // requireAuth middleware ile kimlik doğrulaması yapıldığı için req.user mevcut olacak
    const posts = await postModel.getUserPosts(id);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};


export const getUserComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user!; // requireAuth middleware ile kimlik doğrulaması yapıldığı için req.user mevcut olacak
    const comments = await commentModel.getUserComments(id);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};
