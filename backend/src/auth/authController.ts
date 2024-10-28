// src/controllers/authController.ts

import { Request, Response } from 'express';
import { supabase } from '../auth/supabaseClient';
import { authSchema } from '../utils/validate';
import { z } from 'zod';

// Kullanıcı kayıt
export const signUp = async (req: Request, res: Response) => {
  try {
    // Doğrulama
    const validatedData = authSchema.parse(req.body);
    const { email, password } = validatedData;
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: 'User signed up successfully', user: data.user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: (error as any).message });
  }
};

// Kullanıcı girişi
export const signIn = async (req: Request, res: Response) => {
  try {
    // Doğrulama
    const validatedData = authSchema.parse(req.body);
    const { email, password } = validatedData;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: 'User signed in successfully', user: data.user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: (error as any).message });
  }
};

// Kullanıcı çıkışı
export const signOut = async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: 'User signed out successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
