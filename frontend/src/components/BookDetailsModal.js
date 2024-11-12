import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookDetailsModal.css';

const BookDetailsModal = ({ bookId, onClose }) => {
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/books/${bookId}/`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  if (!book) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>{book.title}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Category:</strong> {book.category}</p>
        <p><strong>Publication Year:</strong> {book.publication_year}</p>
        <p><strong>Publisher:</strong> {book.publisher}</p>
        <p><strong>Description:</strong> {book.description}</p>
        <p><strong>Price:</strong> ${book.price}</p>
      </div>
    </div>
  );
};

export default BookDetailsModal;
