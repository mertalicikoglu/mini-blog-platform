import express from 'express';
import { getPosts, getPostById, createPost, updatePost, deletePost, searchPosts } from '../controllers/postController';
import { requireAuth } from '../middleware/authMiddleware'; // Kimlik doğrulama kontrolü için middleware
import { isPostOwner } from '../middleware/authorizationMiddleware'; // Gönderi sahibi kontrolü için middleware

const router = express.Router();

// // Tüm gönderileri getir
// router.get('/', getPosts);

// Gönderileri arama
router.get('/', searchPosts);

// Belirli bir gönderiyi getir
router.get('/:id', getPostById);

// Yeni gönderi oluşturma (sadece kimliği doğrulanmış kullanıcılar)
router.post('/', requireAuth, createPost);

// Belirli bir gönderiyi güncelleme (sadece gönderi sahibi)
router.put('/:id', isPostOwner, updatePost);

// Belirli bir gönderiyi silme (sadece gönderi sahibi)
router.delete('/:id', isPostOwner, deletePost);



export default router;
