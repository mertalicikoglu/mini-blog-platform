import express from 'express';
import { getComments, createComment, updateComment, deleteComment } from '../controllers/commentController';

const router = express.Router();

// Yorum rotalarını tanımlıyoruz
router.get('/', getComments); // Tüm yorumları getirir
router.post('/', createComment); // Yeni bir yorum oluşturur
router.put('/:commentId', updateComment); // Yorumu günceller
router.delete('/:commentId', deleteComment); // Yorumu siler

export default router; // Dosyayı modül haline getirir
