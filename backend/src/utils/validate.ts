// src/utils/validate.ts

import { z } from 'zod';

// Post Validation Schema
export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
});

// Comment Validation Schema
export const commentSchema = z.object({
  post_id: z.string(),
  content: z.string().min(1, "Content is required").max(500, "Content is too long"),
});

// User Registration and Login Validation Schema
export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});