import React, { useState } from 'react';
import UserReviews from './UserReviews';
import UserRecommendations from './UserRecommendations';
import './UserProfile.css';

const UserProfile = ({ isAdmin }) => {
  const [activeSection, setActiveSection] = useState('reviews');

  if (isAdmin) {
    return <p>Access denied. This page is for users only.</p>;
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-nav">
        <button onClick={() => setActiveSection('reviews')}>My Reviews</button>
        <button onClick={() => setActiveSection('recommendations')}>Recommended for Me</button>
      </div>
      <div className="profile-content">
        {activeSection === 'reviews' ? <UserReviews isAdmin={isAdmin} /> : <UserRecommendations />}
      </div>
    </div>
  );
};

export default UserProfile;
