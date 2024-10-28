import express from 'express';
import { getUserProfile, updateUserProfile, getUserPosts, getUserComments } from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

// Kullanıcı profilini getir (kimlik doğrulaması gerekli)
router.get('/profile', requireAuth, getUserProfile);

// Kullanıcı profilini güncelle (kimlik doğrulaması gerekli)
router.put('/profile', requireAuth, updateUserProfile);

// Kullanıcının gönderilerini getir
router.get('/posts', requireAuth, getUserPosts);

// Kullanıcının yorumlarını getir
router.get('/comments', requireAuth, getUserComments);

export default router;
