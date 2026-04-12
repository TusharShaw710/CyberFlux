import express from 'express';
import authRoutes from './routes/auth.routes.js';
import { handleError } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import chatRoutes from './routes/chat.routes.js';
import emailRoutes from './routes/email.routes.js';
import emailAuthRoutes from './routes/email_auth.routes.js';
import morgan from 'morgan';
import fileRoutes from "./routes/file.route.js";

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://cyber-flux.vercel.app', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Perplexity API' });
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/email/auth', emailAuthRoutes);
app.use("/api/file", fileRoutes);

// 404 - Not Found Handler
app.use((req, res) => {
  const err = new Error('Route not found');
  err.statusCode = 404;
  throw err;
});

// Global Error Handling Middleware (must be last)
app.use(handleError);

export default app;
