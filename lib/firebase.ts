import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };