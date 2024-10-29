// src/controllers/postController.ts

import { Request, Response, NextFunction } from 'express';
import * as postModel from '../models/postModel';
import { postSchema } from '../utils/validate';
import { NotFoundError, UnauthorizedError } from '../errors/AppError';
import { z } from 'zod';
import { User } from '@supabase/supabase-js';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
// Tüm postları getirme
export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10; // Sayfa başına gönderi sayısı
    const offset = (page - 1) * limit;
    const posts = await postModel.getAllPosts(offset, limit);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Belirli bir postu getirme
export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const post = await postModel.getPostById(id);
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// Yeni post oluşturma
export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = postSchema.parse(req.body);
    const postData = {
      ...validatedData,
      user_id: req.user!.id,
    };
    const newPost = await postModel.createPost(postData);
    res.status(201).json(newPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return
    }
    next(error);
  }
};

// Postu güncelleme
export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = postSchema.partial().parse(req.body);
    const post = await postModel.getPostById(id);
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    if (post.user_id !== req.user!.id) {
      throw new UnauthorizedError('You are not authorized to update this post');
    }
    const updatedPost = await postModel.updatePost(id, validatedData);
    res.json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return
    }
    next(error);
  }
};


// Postu silme
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const post = await postModel.getPostById(id);
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    if (post.user_id !== req.user!.id) {
      throw new UnauthorizedError('You are not authorized to delete this post');
    }
    await postModel.deletePost(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};



export const searchPosts = async (req: Request, res: Response) => {
  const { search, page = 1, limit = 10 } = req.query;

  try {
    const posts = await postModel.getPosts(search as string, Number(page), Number(limit));
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching posts' });
  }
};
