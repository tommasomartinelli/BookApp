import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UserReviews from './pages/UserReviews';
import SelectMode from './pages/SelectMode';
import UserProfile from './pages/UserProfile';

function App() {
  const [isAdmin, setIsAdmin] = useState(null);

  return (
    <Router>
      <Navbar isAdmin={isAdmin} />
      <div className="content">
        <Routes>
          <Route
            path="/"
            element={isAdmin === null ? <Navigate to="/select-mode" /> : <HomePage isAdmin={isAdmin} />}  // Passa isAdmin qui
          />
          <Route path="/select-mode" element={<SelectMode setIsAdmin={setIsAdmin} />} />
          <Route path="/profile" element={<UserProfile isAdmin={isAdmin} />} />
          <Route path="/user-reviews" element={<UserReviews isAdmin={isAdmin} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;