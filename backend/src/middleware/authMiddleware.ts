import { Request, Response, NextFunction } from 'express';
import { supabase } from '../auth/supabaseClient';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header is missing' });
    return; // Exiting the function early after responding
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Token is missing' });
    return; // Exiting the function early after responding
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return; // Exiting the function early after responding
  }

  req.user = data.user; // Adding the user to the request object
  next(); // Continuing the function, in this case it will return void
};