import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditBook from './EditBook';
import './BookList.css';

const BookList = ({ refresh }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBookId, setEditBookId] = useState(null);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/books/');
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [refresh]);

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

  if (loading) {
    return <p>Loading books...</p>;
  }

  return (
    <div className="table-container">
      <h2>Book List</h2>
      {editBookId ? (
        <EditBook
          bookId={editBookId}
          onBookUpdated={() => setEditBookId(null)}
          onCancel={() => setEditBookId(null)}
        />
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