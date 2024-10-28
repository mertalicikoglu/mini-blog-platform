import express from 'express';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import authRoutes from './auth/authRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json()); // JSON desteği
app.use('/api/auth', authRoutes); // Kimlik doğrulama rotaları
app.use('/api/posts', postRoutes); // Post rotaları
app.use('/api/posts/:postId/comments', commentRoutes); // Comment rotaları

// Global hata yakalama middleware'i
app.use(errorHandler);

export default app;
