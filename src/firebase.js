import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';  // ← FIXED: Import persistence
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBCqUdpSXzdWBJ5NLPJCnbTxRjHwuAsoGE",
  authDomain: "maze-game-9c34e.firebaseapp.com",
  projectId: "maze-game-9c34e",
  storageBucket: "maze-game-9c34e.firebasestorage.app",
  messagingSenderId: "558938012825",
  appId: "1:558938012825:web:19596025da2aa3034c8c08",
  measurementId: "G-4DQ4Q7WH3K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// ✅ Enable offline persistence (NOW WORKS!)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser does not support persistence');
  }
});

export { auth, db };  // ✅ Analytics is optional, not exported