import React, { useState } from 'react';
import axios from 'axios';
import './AddReview.css'; 

const AddReview = ({ bookId, onReviewAdded }) => {
  const [rating, setRating] = useState(1);
  const [summary, setSummary] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post(`http://localhost:8000/api/books/${bookId}/add-review/`, {
        book_id: bookId,
        rating,
        summary,
        review_text: reviewText,
      });
      onReviewAdded();
    } catch (err) {
      setError("You have already entered a review for this book. You can see it in my profile section!");
    }
  };

  return (
    <div className="review-modal">
      <h3>Add Your Review</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
          />
        </div>
        <div className="form-group">
          <label>Summary:</label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Write a short summary..."
          />
        </div>
        <div className="form-group">
          <label>Review Text:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about the book..."
          />
        </div>
        <button type="submit" className="submit-button">Submit Review</button>
      </form>
    </div>
  );
};

export default AddReview;
