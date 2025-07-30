// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7eokp25RnA0x-IHtJiJOulOQJElyBva4",
  authDomain: "act2-70730.firebaseapp.com",
  projectId: "act2-70730",
  storageBucket: "act2-70730.appspot.com",
  messagingSenderId: "614227992401",
  appId: "1:614227992401:web:c8c5da69e4731a6c243d70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
