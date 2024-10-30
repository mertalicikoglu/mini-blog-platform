import express from 'express';
import { requireAuth } from '../middleware/authMiddleware'; // Kimlik doğrulama kontrolü için middleware
import { getComments, createComment, updateComment, deleteComment } from '../controllers/commentController';
import { isCommentOwner } from '../middleware/authorizationMiddleware'; // Gönderi sahibi kontrolü için middleware

const router = express.Router();

// Yorum rotalarını tanımlıyoruz
router.get('/', getComments); // Belirli bir gönderiye ait tüm yorumları getirir
router.post('/', requireAuth, createComment); // Yeni bir yorum oluşturur
router.put('/:commentId', requireAuth, isCommentOwner, updateComment); // Yorumu günceller
router.delete('/:commentId', requireAuth, isCommentOwner, deleteComment); // Yorumu siler

export default router; // Dosyayı modül haline getirir