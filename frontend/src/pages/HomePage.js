import React, { useState } from 'react';
import AddBook from '../components/AddBook';
import BookList from '../components/BookList';
import './HomePage.css';

const HomePage = () => {
  const [showAddBook, setShowAddBook] = useState(false);
  const [showBookList, setShowBookList] = useState(false);

  const handleAddBookOpen = () => {
    setShowAddBook(true);
    setShowBookList(false); // Nasconde la lista dei libri quando si apre AddBook
  };

  const handleBookAdded = () => {
    setShowAddBook(false); // Chiude AddBook dopo Save o Cancel
    setShowBookList(true); // Mostra la lista dei libri aggiornati
  };

  return (
    <div className="homepage">
      <h1>Welcome to Bookstore App</h1>
      <img
        src="https://us.123rf.com/450wm/carloscaina01/carloscaina012303/carloscaina01230300268/202669895-immagine-sfocata-di-scaffali-in-libreria-per-l-utilizzo-in-background.jpg"
        alt="Library"
        className="cover-image"
      />
      <div className="button-group">
        <button onClick={handleAddBookOpen}>Add Book</button>
        <button onClick={() => setShowBookList(!showBookList)}>
          {showBookList ? 'Hide Books' : 'Show Books'}
        </button>
      </div>

      {showAddBook && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddBook(false)}>
              &times;
            </span>
            <AddBook onBookAdded={handleBookAdded} /> {/* Usa handleBookAdded */}
          </div>
        </div>
      )}

      {showBookList && <BookList />}
    </div>
  );
};

export default HomePage;