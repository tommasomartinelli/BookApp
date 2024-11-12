import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAdmin }) => {
  const navigate = useNavigate();

  const handleBackToSelection = () => {
    navigate('/select-mode'); // Navigate to mode selection
  };

  return (
    <nav className="navbar">
      <h1>Bookstore App</h1>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {!isAdmin && (
          <li>
            <Link to="/profile">My Profile</Link>
          </li>
        )}
        <li>
          <button onClick={handleBackToSelection} className="mode-selection-button">
            Back to Mode Selection
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
