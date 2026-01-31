import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';

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

// ML service internal URL (same container on Render)
const ML_INTERNAL_URL = process.env.ML_INTERNAL_URL || 'http://127.0.0.1:5000';

// ML Health proxy (GET -> /health)
app.use('/api/ml-health', createProxyMiddleware({
  target: ML_INTERNAL_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/ml-health': '/health' },
}));

// ML Predict proxy (POST -> /predict). Ensure JSON body is forwarded.
app.use('/api/estimate', createProxyMiddleware({
  target: ML_INTERNAL_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/estimate': '/predict' },
  onProxyReq: (proxyReq, req) => {
    if (req.body && Object.keys(req.body).length) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
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
