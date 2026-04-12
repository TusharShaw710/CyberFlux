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
const allowedOrigins = [
  'http://localhost:5173',
  'https://cyber-flux.vercel.app',
  'https://cyber-flux-crmi.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean); // Filter out empty values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin matches any allowed origin or is a Vercel preview
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type'] // Important for SSE/Streaming
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
