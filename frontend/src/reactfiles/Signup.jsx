// src/reactfiles/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../cssfiles/Auth.css';
import logo from '../images/logo.png';
import books from '../images/books.png';

function Signup() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.status === 201) {
        setForm({
          name: '',
          username: '',
          email: '',
          password: ''
        });
        navigate('/login'); // Redirect to login page after successful signup
      }
    } catch (error) {
      setMessage('Error occurred during signup');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src={books} alt="Books" />
      </div>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <img src={logo} alt="Logo" />
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Signup</button>
          {message && <p>{message}</p>}
          <p>Already have an account? <Link to="/login">LogIn</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
