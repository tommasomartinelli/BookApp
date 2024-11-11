import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import EditBook from './EditBook';
import BookDetails from './BookDetails';
import './BookList.css';

const BookList = ({ refresh }) => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    author: '',
    title: '',
    category: '',
    max_price: '',
  });
  const [editBookId, setEditBookId] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Usando useCallback per memorizzare fetchBooks ed evitare loop
  const fetchBooks = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/books/', {
        params: {
          ...filters,
        },
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }, [filters]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks, refresh]);

  const handleEdit = (bookId) => {
    setEditBookId(bookId);
  };

  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`http://localhost:8000/api/books/${bookId}/`);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleCloseDetails = () => {
    setSelectedBookId(null);
  };

  return (
    <div className="table-container">
      <h2>Book List</h2>

      <div className="filters">
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={filters.author}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={filters.title}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="max_price"
          placeholder="Max Price"
          value={filters.max_price}
          onChange={handleFilterChange}
        />
      </div>

      {editBookId ? (
        <EditBook
          bookId={editBookId}
          onBookUpdated={() => setEditBookId(null)}
          onCancel={() => setEditBookId(null)}
        />
      ) : selectedBookId ? (
        <BookDetails bookId={selectedBookId} onClose={handleCloseDetails} />
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.price}</td>
                <td>{book.category}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-button" onClick={() => handleEdit(book.id)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(book.id)}>
                      Delete
                    </button>
                    <button className="details-button" onClick={() => setSelectedBookId(book.id)}>
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookList;
