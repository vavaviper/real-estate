import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import estimateRouter from './routes/estimate.route.js';
import cookieParser from 'cookie-parser';

// compute file-based __dirname for ESM and load .env from same folder as this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// ensure MONGO is present
if (!process.env.MONGO) {
  console.error(`MONGO env var not set. Make sure ${path.join(__dirname, '.env')} exists and contains MONGO=...`);
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(cookieParser());

// register routes and static assets before starting server
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/estimate', estimateRouter);

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// connect to DB first, then start the server
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