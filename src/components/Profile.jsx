import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      const userRef = doc(db, 'users', user.uid);

      // Wait for Firestore to be ready
      const unsubscribeFirestore = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setError('No profile data found.');
          }
          setLoading(false);
        },
        (err) => {
          console.error('Firestore error:', err);
          setError('Failed to load profile. Please try again.');
          setLoading(false);
        }
      );

      return () => unsubscribeFirestore();
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="profile-container">
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Points:</strong> {userData.points || 0}</p>
      <button onClick={() => navigate('/home')}>Back to Home</button>
    </div>
  );
};

export default Profile;