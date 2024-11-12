import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectMode.css';

const SelectMode = ({ setIsAdmin }) => {
  const navigate = useNavigate();

  const handleUserMode = () => {
    setIsAdmin(false); 
    navigate('/');
  };

  const handleAdminMode = () => {
    setIsAdmin(true); 
    navigate('/');
  };

  return (
    <div className="select-mode-container">
      <h1>📚Welcome to the Bookstore App!📚</h1>
      <p className="mode-description">
        Choose User Mode to browse and review books, or Admin Mode to manage the bookstore's collection.
      </p>
      <h2>Select Mode</h2>
      <div className="select-mode-buttons">
        <button className="select-mode-button user-button" onClick={handleUserMode}>
          User Mode
        </button>
        <button className="select-mode-button admin-button" onClick={handleAdminMode}>
          Admin Mode
        </button>
      </div>
    </div>
  );
};

export default SelectMode;