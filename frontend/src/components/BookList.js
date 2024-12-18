import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import EditBook from './EditBook';
import BookDetails from './BookDetails';
import AddReview from './AddReview';
import './BookList.css';

const BookList = ({ refresh, isAdmin }) => {  // Aggiungi isAdmin come prop
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    author: '',
    title: '',
    category: '',
    max_price: '',
  });
  const [editBookId, setEditBookId] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('');
  const [showAddReview, setShowAddReview] = useState(null); // Gestisce la visualizzazione del form di recensione

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Fetch books with filters and sorting applied
  const fetchBooks = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/books/', {
        params: {
          ...filters,
          sort_by: sortDirection + sortColumn,
        },
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }, [filters, sortColumn, sortDirection]);

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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === '' ? '-' : ''); // Toggles between ascending and descending
    } else {
      setSortColumn(column);
      setSortDirection('');
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
          onBookUpdated={() => {
            setEditBookId(null);
            fetchBooks();
          }}
          onCancel={() => setEditBookId(null)}
        />
      ) : selectedBookId ? (
        <BookDetails bookId={selectedBookId} onClose={handleCloseDetails} />
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th onClick={() => handleSort('title')}>
                Title <span className="sort-icon">{sortColumn === 'title' && (sortDirection === '' ? '▲' : '▼')}</span>
              </th>
              <th onClick={() => handleSort('author')}>
                Author <span className="sort-icon">{sortColumn === 'author' && (sortDirection === '' ? '▲' : '▼')}</span>
              </th>
              <th onClick={() => handleSort('price')}>
                Price <span className="sort-icon">{sortColumn === 'price' && (sortDirection === '' ? '▲' : '▼')}</span>
              </th>
              <th onClick={() => handleSort('category')}>
                Category <span className="sort-icon">{sortColumn === 'category' && (sortDirection === '' ? '▲' : '▼')}</span>
              </th>
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
                    {isAdmin ? (
                      <>
                        <button className="edit-button" onClick={() => handleEdit(book.id)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => handleDelete(book.id)}>
                          Delete
                        </button>
                      </>
                    ) : (
                      <button className="review-button" onClick={() => setShowAddReview(book.id)}>
                        Add Review
                      </button>
                    )}
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

      {showAddReview && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddReview(null)}>
              &times;
            </span>
            <AddReview bookId={showAddReview} onReviewAdded={() => setShowAddReview(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;