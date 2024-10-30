import express, { Request } from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
//import { initializeDatabase } from './initializeDatabase';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json()); // JSON support
//initializeDatabase();

// Adding postId property to Request type for TypeScript
interface CustomRequest extends Request {
  postId?: string;
}

app.use('/api/posts/:postId/comments', (req, res, next) => {
  (req as CustomRequest).postId = req.params.postId;
  next();
}, commentRoutes); // Comment routes

app.use('/api/posts', postRoutes); // Post routes

// Global error handling middleware
app.use(errorHandler);

export default app;