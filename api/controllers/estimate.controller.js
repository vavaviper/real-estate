import { errorHandler } from '../utils/error.js';

const ML_URL = process.env.ML_URL || 'http://127.0.0.1:8001/predict';

export const getEstimate = async (req, res, next) => {
  try {
    const payload = req.body;

    const response = await fetch(ML_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return next(errorHandler(502, `ML service error: ${text}`));
    }

    const data = await response.json();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
