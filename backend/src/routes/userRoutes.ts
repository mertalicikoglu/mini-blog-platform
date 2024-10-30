import express from 'express';
import { getUserProfile, updateUserProfile, getUserPosts, getUserComments } from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

// Fetch user profile (authentication required)
router.get('/profile', requireAuth, getUserProfile);

// Update user profile (authentication required)
router.put('/profile', requireAuth, updateUserProfile);

// Fetch user's posts
router.get('/posts', requireAuth, getUserPosts);

// Fetch user's comments
router.get('/comments', requireAuth, getUserComments);

export default router;