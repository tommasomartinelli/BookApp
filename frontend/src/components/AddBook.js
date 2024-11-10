
import React, { useState } from 'react';
import axios from 'axios';

const AddBook = ({ onBookAdded }) => {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBook = {
      id: parseInt(id),
      title,
      author: author || 'Unknown',  // Default value if empty
      price: parseFloat(price),
      category: category || 'Unknown',  // Default value if empty
      publication_year: parseInt(publicationYear),
      publisher: publisher || 'Unknown',  // Default value if empty
      description: description || 'Empty',  // Default value if empty
    };

    try {
      await axios.post('http://localhost:8000/api/books/', newBook);
      onBookAdded();
      setId('');
      setTitle('');
      setAuthor('');
      setPrice('');
      setCategory('');
      setPublicationYear('');
      setPublisher('');
      setDescription('');
      setError(null);
    } catch (error) {
      console.error("Error adding book:", error.response?.data || error.message);
      setError(error.response?.data || "An error occurred");
    }
  };

  return (
    <div>
      <h2>Add New Book</h2>
      {error && <p style={{ color: 'red' }}>{JSON.stringify(error)}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
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
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;