import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserReviews = ({ isAdmin }) => {
  const [reviews, setReviews] = useState([]);
  const userId = 'test_user'; // ID utente di prova

  useEffect(() => {
    if (!isAdmin) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/user/${userId}/reviews`);
          const reviewsWithBookData = await Promise.all(response.data.map(async (review) => {
            const bookResponse = await axios.get(`http://localhost:8000/api/books/${review.book_id}/details`);
            return {
              ...review,
              book_title: bookResponse.data.title,
              book_author: bookResponse.data.author,
              book_category: bookResponse.data.category,
            };
          }));
          setReviews(reviewsWithBookData);
        } catch (error) {
          console.error("Error fetching user reviews:", error);
        }
      };
      fetchReviews();
    }
  }, [isAdmin]);

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:8000/api/review/${reviewId}/delete`);
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (isAdmin) return null;

  return (
    <ul className="review-list">
      {reviews.map((review) => (
        <li key={review.id} className="review-item">
          <div className="review-info">
            <h2 className="review-title">{review.book_title}</h2>
            <p className="review-details"><strong>Author:</strong> {review.book_author}</p>
            <p className="review-details"><strong>Category:</strong> {review.book_category}</p>
            <p className="review-details">{review.review_text}</p>
            <div className="review-rating">Rating: {review.rating} ⭐</div>
          </div>
          <button className="delete-button" onClick={() => handleDelete(review.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default UserReviews;
