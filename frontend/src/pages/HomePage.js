import React, { useState } from 'react';
import AddBook from '../components/AddBook';
import BookList from '../components/BookList';
import './HomePage.css';

const HomePage = ({ isAdmin }) => {
  const [showAddBook, setShowAddBook] = useState(false);
  const [showBookList, setShowBookList] = useState(false);

  const handleAddBookOpen = () => {
    setShowAddBook(true);
    setShowBookList(false);
  };

  const handleBookAdded = () => {
    setShowAddBook(false);
    setShowBookList(true);
  };

  return (
    <div className="homepage">
      <h1>Welcome to the Bookstore App</h1>
      <p className="homepage-description">
        {isAdmin
          ? "Manage books, update the catalog, and add new titles!"
          : "Explore our collection and find your next favorite book!"}
      </p>
      <img
        src="https://us.123rf.com/450wm/carloscaina01/carloscaina012303/carloscaina01230300268/202669895-immagine-sfocata-di-scaffali-in-libreria-per-l-utilizzo-in-background.jpg"
        alt="Library"
        className="cover-image"
      />
      <div className="button-group">
        {isAdmin && (
          <button className="main-button" onClick={handleAddBookOpen}>Add Book</button>
        )}
        <button className="main-button" onClick={() => setShowBookList(!showBookList)}>
          {showBookList ? 'Hide Books' : 'Show Books'}
        </button>
      </div>

      {showAddBook && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddBook(false)}>
              &times;
            </span>
            <AddBook onBookAdded={handleBookAdded} />
          </div>
        </div>
      )}

      {showBookList && <BookList isAdmin={isAdmin} />}
    </div>
  );
};

export default HomePage;
