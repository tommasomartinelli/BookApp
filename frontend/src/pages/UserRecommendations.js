import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookDetailsModal from '../components/BookDetailsModal';
import './UserProfile.css';

const UserRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const userId = 'test_user';

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/${userId}/recommendations`);
        setRecommendations(response.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleViewDetails = (bookId) => {
    setSelectedBookId(bookId);
  };

  const closeModal = () => {
    setSelectedBookId(null);
  };

  return (
    <div className="profile-content">
      <h2>Recommended for Me</h2>
      <ul className="review-list">
        {recommendations.map((book) => (
          <li key={book.id} className="review-item">
            <div className="review-info">
              <h3 className="review-title">{book.title}</h3>
              <p className="review-details"><strong>Author:</strong> {book.author}</p>
              <p className="review-details"><strong>Category:</strong> {book.category}</p>
            </div>
            <button 
              className="details-button" 
              onClick={() => handleViewDetails(book.id)}>
              View Details
            </button>
          </li>
        ))}
      </ul>
      {selectedBookId && <BookDetailsModal bookId={selectedBookId} onClose={closeModal} />}
    </div>
  );
};

export default UserRecommendations;