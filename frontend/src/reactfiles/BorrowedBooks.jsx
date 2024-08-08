import React, { useState, useEffect } from 'react';
import '../cssfiles/BorrowedBooks.css';

const BorrowedBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [overdueFilter, setOverdueFilter] = useState(false);
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
    .then(data => {
      console.log('Borrowed Books:', data); // تحقق من البيانات المسترجعة
      setBooks(data);
    })
    .catch(err => console.error('Error fetching borrowed books:', err));
};

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleReturnBook = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const confirmReturnBook = () => {
    const token = localStorage.getItem('accessToken');
    fetch('/api/books/return', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bookId: selectedBook._id })
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        setShowModal(false);
        fetchBorrowedBooks();  // Refresh the list
      })
      .catch(err => console.error('Error returning book:', err));
  };

  const handleOverdueFilter = () => {
    setOverdueFilter(!overdueFilter);
  };

  const filteredBooks = books.filter(book => {
    const isOverdue = overdueFilter ? (new Date() - new Date(book.borrowDate)) / (1000 * 60 * 60 * 24) > 7 : true;
    return isOverdue && (
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="borrowed-books-page">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search borrowed books..." 
          value={searchTerm} 
          onChange={handleSearch} 
        />
        <button className="overdue-books-button" onClick={handleOverdueFilter}>
          {overdueFilter ? 'Show All' : 'Overdue Books'}
        </button>
      </div>

      {filteredBooks.length > 0 ? (
        <table className="borrowed-books-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Student ID</th>
              <th>Borrow Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.borrowedBy ? book.borrowedBy.studentId : 'N/A'}</td>
                <td>{book.borrowedDate ? new Date(book.borrowedDate).toLocaleDateString() : 'N/A'}</td>

                <td>
                  <button onClick={() => handleReturnBook(book)}>Return Book</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No books {overdueFilter ? 'overdue' : 'found'}.</p>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to return the book "{selectedBook.title}" borrowed by student ID {selectedBook.borrowedBy?.studentId}?</p>
            <button onClick={confirmReturnBook}>Yes</button>
            <button onClick={() => setShowModal(false)}>No</button>
          </div>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default BorrowedBooks;
