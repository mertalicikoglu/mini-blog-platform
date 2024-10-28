import { Request, Response, NextFunction } from 'express';
import * as postModel from '../models/postModel';

export const isPostOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const post = await postModel.getPostById(id);

        if (!post) {
             res.status(404).json({ error: 'Post not found' });
             return;
        }

        // Kullanıcı kimliğiyle karşılaştırıyoruz
        if (post.user_id !== req.user?.id) {
             res.status(403).json({ error: 'Forbidden: You do not own this post' });
             return
        }

        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};



