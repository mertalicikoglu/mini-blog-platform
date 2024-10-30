import express from 'express';
import { requireAuth } from '../middleware/authMiddleware'; // Middleware for authentication check
import { getComments, createComment, updateComment, deleteComment } from '../controllers/commentController';
import { isCommentOwner } from '../middleware/authorizationMiddleware'; // Middleware for post ownership check

const router = express.Router();

// Define comment routes
router.get('/', getComments); // Fetch all comments for a specific post
router.post('/', requireAuth, createComment); // Create a new comment
router.put('/:commentId', requireAuth, isCommentOwner, updateComment); // Update a comment
router.delete('/:commentId', requireAuth, isCommentOwner, deleteComment); // Delete a comment

export default router; // Export the file as a module