# Varsha-Estate

This project is a real estate listing website built using the MERN stack—MongoDB, Express.js, React, and Node.js. It features advanced authentication with JWT, Firebase, and Google OAuth to ensure secure user access. The application supports real-world CRUD operations for property listings, offers a user-friendly interface with image uploads, and includes advanced search functionality. You can also deploy and run the application seamlessly.

## Price Estimation (ML Integration)

A small scikit-learn model has been added to provide property price estimates based on historical housing data (`Housing.csv`).

How it works:

- Train the model: see `ml/README.md`.
- Run the ML service: `uvicorn app:app --reload --port 8001`.
- Node backend exposes a proxy: `POST /api/estimate` which forwards requests to the ML service (default ML_URL=http://127.0.0.1:8001/predict).
- Frontend: Listing pages include an "Estimate price" button to request predictions.

If you want, I can add a CI job to run training and a small smoke test.

To access and explore the live demo of this real estate marketplace, visit: https://varsha-estate.onrender.com
