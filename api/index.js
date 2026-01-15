import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
// Remove estimateRouter if the Python server handles it
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config(); 
const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookieParser());

// --- ROUTES ---

// 1. Specific API Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// 2. ML Proxy (MUST be above the wildcard '*' route)
app.use('/api/estimate', createProxyMiddleware({ 
  target: 'http://127.0.0.1:5000', 
  changeOrigin: true 
}));

// 3. Static Files
app.use(express.static(path.join(__dirname, '/client/dist')));

// 4. Wildcard Route (MUST be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Connect to DB and Start Server
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}!`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
