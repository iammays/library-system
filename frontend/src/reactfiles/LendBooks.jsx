import React, { useState, useEffect } from 'react';
import '../cssfiles/LendBooks.css';

const LendBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAvailableBooks();
  }, []);

  const fetchAvailableBooks = () => {
    const token = localStorage.getItem('accessToken');
    fetch('/api/books/available', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setBooks(data);
      setFilteredBooks(data); // Set books initially
    })
    .catch(err => console.error('Error fetching available books:', err));
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    if (searchTerm.length > 0) {
      const filtered = books.filter(book => book.title.toLowerCase().includes(searchTerm));
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks([]); // Clear filtered books if search term is empty
    }
  };

  const handleLendBook = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const book = books.find(book => book.title.toLowerCase() === selectedBook.toLowerCase());
    if (!book) return setMessage('Book not found!');

    fetch('/api/books/lend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ studentId, bookId: book._id })
    })
    .then(res => res.json())
    .then(data => {
      setMessage(data.message);
      if (data.success) {
        fetchAvailableBooks(); // Refresh the list of available books
        handleModalClose();
      }
    })
    .catch(err => setMessage('An error occurred'));
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setMessage('');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSearchTerm('');
    setSelectedBook('');
    setStudentId('');
    setFilteredBooks([]);
  };

  return (
    <div className="lend-books-page">
      <div className="header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by book name or author"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="add-book-button" onClick={handleModalOpen}>Lend Book</button>
        </div>
      </div>

      <table className="books-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map(book => (
            <tr key={book._id}>
              <td>
                <img src={book.cover} alt={book.title} className="book-cover" />
              </td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category.name}</td>
              <td>{book.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Lend Book</h2>
            <form onSubmit={handleLendBook}>
              <div className="form-group">
                <label htmlFor="bookTitle">Book Name:</label>
                <input
                  type="text"
                  id="bookTitle"
                  value={searchTerm}
                  onChange={handleSearch}
                  required
                />
                {searchTerm.length > 0 && filteredBooks.length > 0 && (
                  <ul className="suggestions-list">
                    {filteredBooks.map(book => (
                      <li 
                        key={book._id} 
                        onClick={() => {
                          setSelectedBook(book.title);
                          setSearchTerm(book.title); // Set search term to selected book
                          setFilteredBooks([]); // Clear suggestions
                        }}
                      >
                        {book.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="studentId">Student ID:</label>
                <input
                  type="text"
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="add-book-button">Lend Book</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default LendBooks;
