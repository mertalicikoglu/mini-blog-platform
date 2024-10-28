import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof AppError) {
    // Eğer özel hata sınıfımızsa
    res.status(err.statusCode).json({ error: err.message });
  } else {
    // Diğer beklenmeyen hatalar için
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
