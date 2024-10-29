import express from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
//import { initializeDatabase } from './initializeDatabase';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json()); // JSON desteği
//initializeDatabase();
app.use('/api/posts', postRoutes); // Post rotaları
app.use('/api/posts/:postId/comments', commentRoutes); // Comment rotaları

// Global hata yakalama middleware'i
app.use(errorHandler);

export default app;
