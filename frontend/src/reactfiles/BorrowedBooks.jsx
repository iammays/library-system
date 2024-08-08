import React, { useState, useEffect } from 'react';
import '../cssfiles/BorrowedBooks.css';

const BorrowedBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = () => {
    const token = localStorage.getItem('accessToken');
    fetch('/api/books/borrowed', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error('Error fetching borrowed books:', err));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleReturnBook = (bookId) => {
    const token = localStorage.getItem('accessToken');
    fetch('/api/books/return', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bookId })
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        fetchBorrowedBooks();  // Refresh the list
      })
      .catch(err => console.error('Error returning book:', err));
  };

  return (
    <div className="borrowed-books-page">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search borrowed books..." 
          value={searchTerm} 
          onChange={handleSearch} 
        />
      </div>
      <ul>
        {books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase())).map(book => (
          <li key={book._id}>
            <img src={book.cover} alt={book.title} width="50" />
            <p>{book.title} by {book.author}</p>
            <button onClick={() => handleReturnBook(book._id)}>Return Book</button>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BorrowedBooks;
