// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-23c2a.firebaseapp.com",
  projectId: "mern-estate-23c2a",
  storageBucket: "mern-estate-23c2a.appspot.com",
  messagingSenderId: "944919367712",
  appId: "1:944919367712:web:4061e4a6a7f2bc38a7ac45"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);