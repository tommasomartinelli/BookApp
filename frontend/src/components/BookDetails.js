import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookDetails.css';

const BookDetail = ({ bookId }) => {
  const [book, setBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    // Fetch book details
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/books/${bookId}/details/`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    // Fetch recommendations
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/books/${bookId}/recommendations/`);
        setRecommendations(response.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchBookDetails();
    fetchRecommendations();
  }, [bookId]);

  if (!book) {
    return <p>Loading book details...</p>;
  }

  return (
    <div className="book-detail-container">
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Price:</strong> ${book.price}</p>
      <p><strong>Category:</strong> {book.category}</p>
      <p><strong>Publication Year:</strong> {book.publication_year || 'N/A'}</p>
      <p><strong>Publisher:</strong> {book.publisher}</p>
      <p><strong>Description:</strong> {book.description}</p>
      <p><strong>Reviews:</strong> {book.review_count} (Average Rating: {book.avg_rating})</p>

      <h3>Recommended Books</h3>
      {recommendations.length > 0 ? (
        <ul className="recommendations-list">
          {recommendations.map(recBook => (
            <li key={recBook.id}>
              <strong>{recBook.title}</strong> by {recBook.author} - ${recBook.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available.</p>
      )}
    </div>
  );
};

export default BookDetail;
