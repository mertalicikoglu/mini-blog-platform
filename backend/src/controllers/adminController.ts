import { Request, Response, NextFunction } from 'express';
import * as postModel from '../models/postModel';
import { NotFoundError } from '../errors/AppError';

// // Tüm gönderileri getir
// export const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const posts = await postModel.getAllPosts();
//     res.json(posts);
//   } catch (error) {
//     next(error);
//   }
// };

// Bir gönderiyi sil
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const post = await postModel.getPostById(id);
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    await postModel.deletePost(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
