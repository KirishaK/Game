import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-overlay">
        <h1>Main Menu</h1>
        <div className="button-group">
          <div className="column">
            <Link to="/play" className="home-button">Play</Link>
            <Link to="/profile" className="home-button">Profile</Link>
            <Link to="/settings" className="home-button">Settings</Link>
          </div>
          <div className="column">
            <Link to="/leaderboard" className="home-button">Leaderboard</Link>
            <Link to="/levels" className="home-button">Levels</Link>
            <Link to="/" className="home-button">Exit</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;