// src/utils/validate.ts

import { z } from 'zod';

// Post Doğrulama Şeması
export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
});

// Comment Doğrulama Şeması
export const commentSchema = z.object({
  post_id: z.string(),
  content: z.string().min(1, "Content is required").max(500, "Content is too long"),
});

// Kullanıcı Kayıt ve Giriş Doğrulama Şeması
export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
