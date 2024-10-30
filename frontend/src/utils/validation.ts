// src/utils/validate.ts

import { z } from 'zod';

// schema for post validation
export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
});

// schema for comment validation
export const commentSchema = z.object({
  postId: z.string().uuid("Invalid post ID"),
  content: z.string().min(1, "Content is required").max(500, "Content is too long"),
});

// schema for user registration and login validation
export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
