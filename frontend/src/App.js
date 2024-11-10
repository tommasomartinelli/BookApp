import React, { useState } from 'react';
import BookList from './components/BookList';
import AddBook from './components/AddBook';

function App() {
  const [refresh, setRefresh] = useState(false);

  const refreshBooks = () => {
    setRefresh(!refresh); 
  };

  return (
    <div className="App">
      <h1>Bookstore Application</h1>
      <AddBook onBookAdded={refreshBooks} />
      <BookList refresh={refresh} />
    </div>
  );
}

export default App;
