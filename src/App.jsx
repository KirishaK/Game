import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Play from './components/Play';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Leaderboard from './components/Leaderboard';
import Levels from './components/Levels';   
import Cover from './components/Cover';

const router = createBrowserRouter(
  [
    { path: "/", element: <Cover /> },
    { path: "/home", element: <Home /> },
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },
    { path: "/play", element: <Play /> },
    { path: "/profile", element: <Profile /> },
    { path: "/settings", element: <Settings /> },
    { path: "/leaderboard", element: <Leaderboard /> },
    { path: "/levels", element: <Levels /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
      v7_partialHydration: true,
      v7_normalizeFormMethod: true,
      v7_fetcherPersist: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;