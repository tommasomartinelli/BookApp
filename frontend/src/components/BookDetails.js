import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookDetails.css';

const BookDetail = ({ bookId, onClose }) => {
  const [book, setBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [currentBookId, setCurrentBookId] = useState(bookId);

  useEffect(() => {
    const fetchBookDetails = async (id) => {
      try {
        const response = await axios.get(`http://localhost:8000/api/books/${id}/details/`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/books/${currentBookId}/recommendations/`);
        setRecommendations(response.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchBookDetails(currentBookId);
    fetchRecommendations();
  }, [currentBookId]);

  if (!book) {
    return <p>Loading book details...</p>;
  }

  return (
    <div className="modal-overlay">
      <div className="book-detail-modal">
        <button className="close-button" onClick={() => onClose(null)}>×</button>
        <h2>{book.title}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Price:</strong> ${book.price}</p>
        <p><strong>Category:</strong> {book.category}</p>
        <p><strong>Publication Year:</strong> {book.publication_year || 'N/A'}</p>
        <p><strong>Publisher:</strong> {book.publisher}</p>
        <p><strong>Description:</strong> {book.description}</p>

        {/* Separate fields for Reviews and Average Rating */}
        <p><strong>Reviews Count:</strong> {book.review_count}</p>
        <p><strong>Average Rating:</strong> {book.avg_rating}</p>

        <h3>Recommended Books</h3>
        {recommendations.length > 0 ? (
          <ul className="recommendations-list">
            {recommendations.map(recBook => (
              <li key={recBook.id}>
                <strong>{recBook.title}</strong> by {recBook.author} - ${recBook.price}
                <button
                  className="details-button"
                  onClick={() => setCurrentBookId(recBook.id)}
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
