
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditBook = ({ bookId, onBookUpdated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

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
        setError("Failed to load book details");
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBook = {
      id: bookId, 
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
      onBookUpdated();
    } catch (error) {
      console.error("Error updating book:", error.response?.data || error.message);
      setError(JSON.stringify(error.response?.data || "An error occurred"));
    }
  };

  return (
    <div>
      <h2>Edit Book</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input
            type="text"
            value={bookId}  
            readOnly       
            disabled       
          />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          <label>Publication Year:</label>
          <input
            type="number"
            value={publicationYear}
            onChange={(e) => setPublicationYear(e.target.value)}
          />
        </div>
        <div>
          <label>Publisher:</label>
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditBook;