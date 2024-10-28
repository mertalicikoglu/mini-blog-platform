import { Request, Response, NextFunction } from 'express';
import { supabase } from '../auth/supabaseClient';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header is missing' });
    return; // Yanıt verildikten sonra işlevden erken çıkıyoruz
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Token is missing' });
    return; // Yanıt verildikten sonra işlevden erken çıkıyoruz
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return; // Yanıt verildikten sonra işlevden erken çıkıyoruz
  }

  req.user = data.user; // Kullanıcıyı request objesine ekliyoruz.
  next(); // İşleve devam ediyoruz, bu durumda void dönecek
};
