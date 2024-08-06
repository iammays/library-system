import React, { useState, useEffect } from 'react';
import '../cssfiles/Categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token); // Debug log

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
    .then(data => setCategories(Array.isArray(data) ? data : []))
    .catch(error => console.error('Error fetching categories:', error));
  }, []);


  const handleAddCategoryClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: newCategory })
    })
    .then(response => {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized or Forbidden');
      }
      return response.json();
    })
    .then(data => {
      if (data.message) {
        fetch('/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(data => setCategories(Array.isArray(data) ? data : []))
        .catch(error => console.error('Error fetching categories:', error));

        setShowModal(false);
        setNewCategory('');
      }
    })
    .catch(error => console.error('Error adding category:', error));
  };


  console.log('Token:', localStorage.getItem('token'));


  return (
    <div className="categories-page">
      <div className="categories-header">
        <h2>Categories</h2>
        <button className="add-category-button" onClick={handleAddCategoryClick}>Add Category +</button>
      </div>

      <table className="categories-table">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Add New Category</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={newCategory} onChange={handleInputChange} required />
              </div>
              <button type="submit">Add Category</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
