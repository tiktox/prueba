import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCju35pRldKJRx_1GFKcU8yq2XE-HfX1lc",
  authDomain: "hibrown.firebaseapp.com",
  databaseURL: "https://hibrown-default-rtdb.firebaseio.com",
  projectId: "hibrown",
  storageBucket: "hibrown.firebasestorage.app",
  messagingSenderId: "5218708938",
  appId: "1:5218708938:web:a2e53f631d054eb7b3f333",
  measurementId: "G-NY55TT19ZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;