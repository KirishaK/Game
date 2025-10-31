// src/index.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Optional: Force Firebase to retry on network
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);