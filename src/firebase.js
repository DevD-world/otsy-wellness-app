import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- PASTE YOUR CONFIG HERE (From Firebase Console) ---
const firebaseConfig = {
  apiKey: "AIzaSyD113fpNX1-S340L-6CcsxBRX-S3dV_Ka0",
  authDomain: "otsy-wellness.firebaseapp.com",
  projectId: "otsy-wellness",
  storageBucket: "otsy-wellness.firebasestorage.app",
  messagingSenderId: "396633658146",
  appId: "1:396633658146:web:5dbb236d00faddb9b64b7b",
  measurementId: "G-HFKJV3RS7M"
};
// -----------------------------------------------------

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth & Database services to use in other files
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);