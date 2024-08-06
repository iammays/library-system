import React, { useState, useEffect } from 'react';
import '../cssfiles/Books.css';

function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', category: '', status: '', cover: null });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token); // Debug log

    // Fetch books from the backend
    fetch('/api/books', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized or Forbidden');
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        console.error('Books data is not an array:', data);
      }
    })
    .catch(error => console.error('Error fetching books:', error));

    // Fetch categories from the backend
    fetch('/api/categories', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized or Forbidden');
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error('Categories data is not an array:', data);
      }
    })
    .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleAddBookClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewBook({ ...newBook, cover: e.target.files[0] });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    for (let key in newBook) {
      formData.append(key, newBook[key]);
    }
  
    fetch('/api/books', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    .then(response => {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized or Forbidden');
      }
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text) });
      }
      return response.json();
    })
    .then(data => {
      if (data.message) {
        // Fetch updated books list
        fetch('/api/books', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Unauthorized or Forbidden');
          }
          return response.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setBooks(data);
          } else {
            console.error('Books data is not an array:', data);
          }
        })
        .catch(error => console.error('Error fetching books:', error));
  
        setShowModal(false);
        setNewBook({ title: '', author: '', category: '', status: '', cover: null });
      }
    })
    .catch(error => {
      console.error('Error adding book:', error);
      alert(`Error: ${error.message}`); // Display error to user
    });
  };
  
  return (
    <div className="books-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by book name or author"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <button className="add-book-button" onClick={handleAddBookClick}>Add Book +</button>
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
          {books.filter(book => {
            return (
              (searchTerm === '' || book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
              (category === '' || book.category.name === category)
            );
          }).map(book => (
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

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Add New Book</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" value={newBook.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="author">Author:</label>
                <input type="text" id="author" name="author" value={newBook.author} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select id="category" name="category" value={newBook.category} onChange={handleInputChange} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select id="status" name="status" value={newBook.status} onChange={handleInputChange} required>
                  <option value="">Select Status</option>
                  <option value="available">Available</option>
                  <option value="borrowed">Borrowed</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="cover">Cover:</label>
                <input type="file" id="cover" name="cover" onChange={handleFileChange} />
              </div>
              <button type="submit">Add Book</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Books;
