import express from 'express';
import {  deletePost } from '../controllers/adminController';
//import { requireAuth } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/isAdmin';

const router = express.Router();

// Tüm gönderileri getir (sadece adminler)
// router.get('/posts', isAdmin, getAllPosts);

// Bir gönderiyi sil (sadece adminler)
router.delete('/posts/:id', isAdmin, deletePost);

export default router;
