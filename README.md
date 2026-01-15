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

- **Price Estimator**: Predict property prices using a scikit-learn machine learning model trained on historical housing data
- **Smart Valuations**: Get instant property valuations based on features like area, bedrooms, bathrooms, amenities, and location

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
- **scikit-learn** for the GradientBoosting regression model
- **joblib** for model serialization
- **NumPy & Pandas** for data processing

---

## 📁 Project Structure

```
real-estate/
├── api/                          # Node.js backend
│   ├── controllers/              # Route handlers
│   │   ├── auth.controller.js
│   │   ├── listing.controller.js
│   │   ├── estimate.controller.js
│   │   └── user.controller.js
│   ├── models/                   # MongoDB schemas
│   │   ├── user.model.js
│   │   └── listing.model.js
│   ├── routes/                   # API endpoints
│   │   ├── auth.route.js
│   │   ├── listing.route.js
│   │   ├── estimate.route.js
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
│   ├── app.py                    # FastAPI server
│   ├── train.py                  # Model training script
│   ├── model.joblib              # Trained model file
│   ├── requirements.txt
│   └── Housing.csv               # Training dataset
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

**Terminal 3 - ML Service (Port 10000)**

```bash
cd ml
uvicorn app:app --host 0.0.0.0 --port 10000
```

The application will be available at `http://localhost:5173`

---

## 🤖 AI Price Estimation

### How It Works

1. **Model Training**

   - Uses scikit-learn's GradientBoostingRegressor
   - Trained on historical housing data from `Housing.csv`
   - Features include: area, bedrooms, bathrooms, stories, parking, furnishing status, amenities, and location

2. **API Flow**

   - Frontend sends property details to `POST /api/estimate`
   - Backend validates request and forwards to ML service
   - ML service returns predicted price
   - Frontend displays estimation to user

3. **Training the Model**
   ```bash
   cd ml
   python train.py
   ```
   This generates `model.joblib` which the FastAPI server loads at startup.

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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
FIREBASE_API_KEY=your_firebase_key
ML_URL=http://127.0.0.1:10000/predict
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
