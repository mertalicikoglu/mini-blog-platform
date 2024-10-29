import express from 'express';
import { getAllPosts, deletePost } from '../controllers/adminController';
import { requireAuth } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/isAdmin';

const router = express.Router();

// Tüm gönderileri getir (sadece adminler)
router.get('/posts', requireAuth, isAdmin, getAllPosts);

// Bir gönderiyi sil (sadece adminler)
router.delete('/posts/:id', requireAuth, isAdmin, deletePost);

export default router;
