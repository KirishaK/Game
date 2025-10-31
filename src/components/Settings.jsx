import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [sound, setSound] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('light');

  const toggleSound = () => setSound(!sound);
  const toggleNotifications = () => setNotifications(!notifications);
  const changeTheme = (e) => setTheme(e.target.value);

  return (
    <div className={`settings-container ${theme}`}>
      <h1>Settings</h1>
      <div className="setting-option">
        <label>Sound</label>
        <button className={sound ? 'active' : ''} onClick={toggleSound}>
          {sound ? 'On' : 'Off'}
        </button>
      </div>
      <div className="setting-option">
        <label>Notifications</label>
        <button className={notifications ? 'active' : ''} onClick={toggleNotifications}>
          {notifications ? 'Enabled' : 'Disabled'}
        </button>
      </div>
      <div className="setting-option">
        <label>Theme</label>
        <select value={theme} onChange={changeTheme}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;