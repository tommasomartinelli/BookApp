
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookDetails.css';

const BookDetails = ({ bookId, onClose }) => {
  const [bookDetails, setBookDetails] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/books/${bookId}/details/`);
        setBookDetails(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  return (
    <div className="book-details">
      {bookDetails ? (
        <>
          <h2>{bookDetails.title}</h2>
          <p><strong>ID:</strong> {bookDetails.id}</p>
          <p><strong>Author:</strong> {bookDetails.author}</p>
          <p><strong>Category:</strong> {bookDetails.category}</p>
          <p><strong>Publication Year:</strong> {bookDetails.publication_year || 'N/A'}</p>
          <p><strong>Publisher:</strong> {bookDetails.publisher}</p>
          <p><strong>Description:</strong> {bookDetails.description}</p>
          <p><strong>Price:</strong> ${bookDetails.price}</p>
          <p><strong>Review Count:</strong> {bookDetails.review_count}</p>
          <p><strong>Average Rating:</strong> {bookDetails.avg_rating}</p>
        </>
      ) : (
        <p>Loading book details...</p>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default BookDetails;