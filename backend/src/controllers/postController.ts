// src/controllers/postController.ts

import { Request, Response, NextFunction } from 'express';
import * as postModel from '../models/postModel';
import { postSchema } from '../utils/validate';
import { NotFoundError, UnauthorizedError } from '../errors/AppError';
import { z } from 'zod';

// Tüm postları getirme
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await postModel.getAllPosts();
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
export const createPost = async (req: Request, res: Response): Promise<void> => {
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
    res.status(500).json({ error: (error as Error).message });
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
  try {
    const { query } = req.query;
    const posts = await postModel.searchPosts(query as string);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
