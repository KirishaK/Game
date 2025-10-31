// src/components/Cover.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cover.css';

const Cover = () => {
  const navigate = useNavigate();

  return (
    <div className="cover-page">
      <div className="cover-content">
        <h1>WELCOME TO MATH MAZE</h1>
        <p>Challenge your brain with fun puzzles!</p>
        <button className="start-btn" onClick={() => navigate('/login')}>
          START GAME
        </button>
      </div>
    </div>
  );
};

export default Cover;