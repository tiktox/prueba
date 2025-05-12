import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const firebaseStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const firebaseMessagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const firebaseMeasurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

if (!firebaseApiKey) {
  throw new Error("Firebase API Key is not defined. Please set NEXT_PUBLIC_FIREBASE_API_KEY in your .env file. Refer to .env.template for all required Firebase environment variables.");
}
if (!firebaseAuthDomain) {
    throw new Error("Firebase Auth Domain is not defined. Please set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN in your .env file.");
}
if (!firebaseProjectId) {
    throw new Error("Firebase Project ID is not defined. Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID in your .env file.");
}
if (!firebaseStorageBucket) {
    throw new Error("Firebase Storage Bucket is not defined. Please set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in your .env file.");
}
if (!firebaseMessagingSenderId) {
    throw new Error("Firebase Messaging Sender ID is not defined. Please set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID in your .env file.");
}
if (!firebaseAppId) {
    throw new Error("Firebase App ID is not defined. Please set NEXT_PUBLIC_FIREBASE_APP_ID in your .env file.");
}


const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: firebaseMeasurementId,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

export { app, auth, db, storage };

