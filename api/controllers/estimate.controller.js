import { errorHandler } from '../utils/error.js';

const ML_URL = process.env.ML_URL || 'https://real-estate-mush.onrender.com/predict';

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
    // Extract the prediction from the ML service response
    const prediction = data.predicted_price;
    res.status(200).json({ success: true, data: { prediction } });
  } catch (error) {
    next(error);
  }
};
