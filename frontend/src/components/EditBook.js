// src/components/EditBook.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddBook.css';  // Usa lo stesso stile di AddBook

const EditBook = ({ bookId, onBookUpdated, onCancel }) => {
  const [id] = useState(bookId);  // Mantieni solo `id`, senza `setId`
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/books/${bookId}/`);
        const book = response.data;
        setTitle(book.title || '');
        setAuthor(book.author || '');
        setPrice(book.price || '');
        setCategory(book.category || '');
        setPublicationYear(book.publication_year || '');
        setPublisher(book.publisher || '');
        setDescription(book.description || '');
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBook = {
      id,
      title,
      author: author || 'Unknown',
      price: parseFloat(price),
      category: category || 'Unknown',
      publication_year: parseInt(publicationYear),
      publisher: publisher || 'Unknown',
      description: description || 'Empty',
    };

    try {
      await axios.put(`http://localhost:8000/api/books/${bookId}/`, updatedBook);
      onBookUpdated();  // Chiude il modulo al termine dell'aggiornamento
    } catch (error) {
      console.error("Error updating book:", error.response?.data || error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ID:</label>
          <input type="number" value={id} disabled />
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Author:</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Publication Year:</label>
          <input type="number" value={publicationYear} onChange={(e) => setPublicationYear(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Publisher:</label>
          <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="button-group">
          <button type="submit" className="save-button">Save</button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;
