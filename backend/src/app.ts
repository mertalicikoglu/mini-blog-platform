import express, { Request } from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
//import { initializeDatabase } from './initializeDatabase';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json()); // JSON desteği
//initializeDatabase();

// TypeScript için postId özelliğini Request türüne eklemek
interface CustomRequest extends Request {
  postId?: string;
}

app.use('/api/posts/:postId/comments', (req, res, next) => {
  (req as CustomRequest).postId = req.params.postId;
  next();
}, commentRoutes); // Comment rotaları

app.use('/api/posts', postRoutes); // Post rotaları

// Global hata yakalama middleware'i
app.use(errorHandler);

export default app;
