import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/AppError';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new UnauthorizedError('You do not have permission to perform this action');
  }
};
