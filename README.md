# Varsha Estate - Real Estate Marketplace

A full-stack real estate listing platform with AI-powered price estimation. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and integrated with machine learning for property valuation.

**Live Demo:** https://varsha-estate.onrender.com

---

## 🌟 Features

### Core Features

- **Property Listings**: Browse, search, and filter properties by type (rent/sale), location, price range, and amenities
- **User Authentication**: Secure JWT-based authentication with Firebase and Google OAuth
- **User Profiles**: View user profiles, manage personal listings, and edit property details
- **Image Uploads**: Upload property images directly to Firebase Cloud Storage
- **Advanced Search**: Filter by multiple criteria including furnished status, parking, amenities, and special offers
- **Property Management**: Full CRUD operations - create, read, update, and delete listings

### AI-Powered Features

- **Price Estimator**: Predict property prices using a PyTorch neural network trained on historical housing data
- **Smart Valuations**: Get instant property valuations based on features like area, bedrooms, bathrooms, amenities, and location
- **Deep Learning**: Multi-layer perceptron (MLP) architecture with 64→32→1 neurons for accurate price predictions

---

## 🛠 Tech Stack

### Frontend

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Redux** for state management
- **React Router** for navigation
- **Firebase Authentication** for Google OAuth
- **React Icons** for UI icons
- **Swiper** for image carousels

### Backend

- **Node.js & Express.js** for the REST API
- **MongoDB** for database
- **JWT** for authentication tokens
- **Firebase Admin SDK** for image uploads
- **Bcryptjs** for password hashing

### Machine Learning

- **Python 3** with FastAPI
- **PyTorch** for neural network regression (MLP architecture)
- **NumPy & Pandas** for data preprocessing and feature engineering
- **JSON** for preprocessing metadata serialization

---

## 📁 Project Structure

```
real-estate/
├── api/                          # Node.js backend
│   ├── controllers/              # Route handlers
│   │   ├── auth.controller.js
│   │   ├── listing.controller.js
│   │   └── user.controller.js
│   ├── models/                   # MongoDB schemas
│   │   ├── user.model.js
│   │   └── listing.model.js
│   ├── routes/                   # API endpoints
│   │   ├── auth.route.js
│   │   ├── listing.route.js
│   │   └── user.route.js
│   ├── utils/                    # Helper functions
│   │   ├── error.js
│   │   └── verifyUser.js
│   ├── index.js                  # Express app entry point
│   ├── package.json
│   └── .env                      # Environment variables
│
├── client/                       # React frontend
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── ListingItem.jsx
│   │   │   ├── OAuth.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── Contact.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── CreateListing.jsx
│   │   │   ├── UpdateListing.jsx
│   │   │   ├── Listing.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Estimate.jsx
│   │   │   └── About.jsx
│   │   ├── redux/                # Redux store & slices
│   │   │   ├── store.js
│   │   │   └── user/userSlice.js
│   │   ├── App.jsx
│   │   ├── firebase.js           # Firebase config
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env                      # Environment variables
│
├── ml/                           # Python ML service
│   ├── app.py                    # FastAPI inference server
│   ├── train.py                  # PyTorch model training script
│   ├── model.pt                  # Trained PyTorch model weights
│   ├── preprocessing.json        # Feature normalization metadata
│   └── requirements.txt          # Python dependencies
│
├── Housing.csv                   # Dataset for ML training
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- MongoDB (local or Atlas)
- Firebase account
- Google OAuth credentials

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/real-estate.git
cd real-estate
```

2. **Backend Setup**

```bash
cd api
npm install
```

Create `.env` file in `api/` directory:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FIREBASE_API_KEY=your_firebase_api_key
ML_URL=http://127.0.0.1:10000/predict
PORT=3000
```

3. **Frontend Setup**

```bash
cd ../client
npm install
```

Create `.env` file in `client/` directory:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

4. **ML Service Setup**

```bash
cd ../ml
pip install -r requirements.txt
```

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend API (Port 3000)**

```bash
cd api
npm start
```

**Terminal 2 - Frontend (Port 5173)**

```bash
cd client
npm run dev
```

**Terminal 3 - ML Service (Port 5000)**

```bash
cd ml
uvicorn app:app --host 0.0.0.0 --port 5000
```

**Or run everything with Concurrently:**

```bash
npm start
```

This starts both the Express server (port 3000) and FastAPI (port 5000) simultaneously.

The application will be available at `http://localhost:5173`

---

## 🤖 AI Price Estimation

### Neural Network Architecture

The model uses a **Multi-Layer Perceptron (MLP)** implemented in PyTorch:

```
Input Layer (14-16 features depending on furnishing categories)
    ↓
Linear(64) → ReLU activation
    ↓
Linear(32) → ReLU activation
    ↓
Linear(1) → Price prediction (output)
```

### How It Works

1. **Data Preprocessing**

   - **Binary Features**: Converts yes/no to 0/1 (mainroad, guestroom, basement, hotwaterheating, airconditioning, prefarea)
   - **Numeric Features**: Standardizes using z-score normalization: `(value - mean) / std`
     - `area`, `bedrooms`, `bathrooms`, `stories`, `parking`
   - **Categorical Features**: One-hot encodes `furnishingstatus` (furnished/semi-furnished/unfurnished)

2. **Training Process**

   - **Optimizer**: Adam with learning rate 0.001
   - **Loss Function**: Mean Squared Error (MSE)
   - **Epochs**: 300 iterations through the dataset
   - **Batch Size**: 32 samples per gradient update
   - **Validation**: 80/20 train/validation split to monitor performance
   - **Metrics**: Root Mean Squared Error (RMSE) reported every 50 epochs

3. **API Flow**

   - Frontend sends property details to `POST /api/estimate`
   - Express proxy forwards request to FastAPI on port 5000 (`/predict` endpoint)
   - FastAPI normalizes features using saved preprocessing metadata
   - PyTorch model performs inference (forward pass)
   - Predicted price returned to frontend

4. **Training the Model**
   ```bash
   cd ml
   python train.py
   ```
   This generates:
   - `model.pt` - PyTorch model weights
   - `preprocessing.json` - Feature means/stds and category mappings

### Model Features

| Feature            | Type        | Description                          |
| ------------------ | ----------- | ------------------------------------ |
| `area`             | Numeric     | Property area in sq ft               |
| `bedrooms`         | Numeric     | Number of bedrooms                   |
| `bathrooms`        | Numeric     | Number of bathrooms                  |
| `stories`          | Numeric     | Number of floors                     |
| `parking`          | Numeric     | Parking spaces                       |
| `mainroad`         | Binary      | Access to main road (0/1)            |
| `guestroom`        | Binary      | Has guest room (0/1)                 |
| `basement`         | Binary      | Has basement (0/1)                   |
| `hotwaterheating`  | Binary      | Has hot water heating (0/1)          |
| `airconditioning`  | Binary      | Has AC (0/1)                         |
| `prefarea`         | Binary      | Located in preferred area (0/1)      |
| `furnishingstatus` | Categorical | furnished/semi-furnished/unfurnished |

### Using the Estimator

1. Navigate to the **Estimate** page
2. Enter property details (area, bedrooms, bathrooms, etc.)
3. Select amenities and furnishing status
4. Click "Get Estimate" to receive AI-powered price prediction

---

## 🔐 Authentication

### JWT Authentication

- Passwords hashed with bcryptjs
- JWT tokens stored securely
- Token validation on protected routes

### Google OAuth

- One-click sign-in with Google
- Automatic user account creation
- Profile data synced from Google

---

## 📊 Database Schema

### User Model

```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  avatar: String (Firebase URL),
  createdAt: Date
}
```

### Listing Model

```javascript
{
  name: String,
  description: String,
  address: String,
  regularPrice: Number,
  discountPrice: Number,
  bathrooms: Number,
  bedrooms: Number,
  furnished: Boolean,
  parking: Boolean,
  type: String (rent/sale),
  offer: Boolean,
  imageUrls: [String],
  userRef: ObjectId,
  createdAt: Date
}
```

---

## 🎨 Design

- **Color Scheme**: Professional blue theme with light blue backgrounds
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, intuitive interface with smooth interactions
- **Font**: DM Sans for typography

---

## 🔄 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/google` - Google OAuth login

### Listings

- `GET /api/listing/get` - Get listings with filters
- `GET /api/listing/:id` - Get single listing
- `POST /api/listing/create` - Create listing
- `PUT /api/listing/update/:id` - Update listing
- `DELETE /api/listing/delete/:id` - Delete listing

### Users

- `GET /api/user/:id` - Get user profile
- `PUT /api/user/update/:id` - Update user profile

### Estimation

- `POST /api/estimate` - Get price estimation

---

## 📝 Environment Variables

### Backend (`api/.env`)

```
MONGO=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
FIREBASE_API_KEY=your_firebase_key
PORT=3000
```

### Frontend (`client/.env`)

```
VITE_FIREBASE_API_KEY=your_firebase_key
```

---

## 🚢 Deployment

The application is deployed on Render.com:

- Frontend hosted on Render
- Backend API on Render
- MongoDB Atlas for database
- Firebase for image storage

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📚 Additional Resources

- [MERN Stack Documentation](https://mern.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [scikit-learn Guide](https://scikit-learn.org/)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/)
