import express from 'express';
import { getComments, createComment, updateComment, deleteComment } from '../controllers/commentController';

const router = express.Router();

// Yorum rotalarını tanımlıyoruz
router.get('/', async (req, res) => {
    const data = await getComments(req, res);
    res.json(data);
}); // Tüm yorumları getirir
router.post('/', async (req, res) => {
    const data = await createComment(req, res);
    res.json(data);
}); // Yeni bir yorum oluşturur
router.put('/:commentId', async (req, res) => {
    const data = await updateComment(req, res);
    res.json(data);
}); // Yorumu günceller
router.delete('/:commentId', async (req, res) => {
    const data = await deleteComment(req, res);
    res.json(data);
}); // Yorumu siler

export default router; // Dosyayı modül haline getirir
