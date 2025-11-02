// src/App.jsx
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Play from './components/Play';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Leaderboard from './components/Leaderboard';
import Levels from './components/Levels';
import Cover from './components/Cover';

const router = createBrowserRouter([
  { path: "/", element: <Cover /> },
  { path: "/home", element: <Home /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/play", element: <Play /> },
  { path: "/profile", element: <Profile /> },
  { path: "/settings", element: <Settings /> },
  { path: "/leaderboard", element: <Leaderboard /> },
  { path: "/levels", element: <Levels /> },
]);


function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Session Active:", user.uid);
      } else {
        console.log("No Session");
      }
    });
    return unsubscribe;
  }, []);

  return <RouterProvider router={router} />;
}

export default App;