import { initializeApp } from "firebase/app";
import firestore from "firebase/firestore";
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "horaplus-b5667.firebaseapp.com",
  projectId: "horaplus-b5667",
  storageBucket: "horaplus-b5667.appspot.com",
  messagingSenderId: "731355843897",
  appId: "1:731355843897:web:06cbd19e00e5d1a5ca6ce8",
  measurementId: "G-2B126M7J9M"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export { firebase, firebaseConfig, firestore };
