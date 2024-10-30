import express from 'express';
import { getPosts, getPostById, createPost, updatePost, deletePost, searchPosts } from '../controllers/postController';
import { requireAuth } from '../middleware/authMiddleware'; // Middleware for authentication check
import { isPostOwner } from '../middleware/authorizationMiddleware'; // Middleware for post ownership check

const router = express.Router();

// Fetch all posts
// router.get('/', getPosts);

// Search posts
router.get('/', searchPosts);

// Fetch a specific post
router.get('/:id', getPostById);

// Create a new post (only authenticated users)
router.post('/', requireAuth, createPost);

// Update a specific post (only post owner)
router.put('/:id', requireAuth, isPostOwner, updatePost);

// Delete a specific post (only post owner)
router.delete('/:id', requireAuth, isPostOwner, deletePost);

export default router;