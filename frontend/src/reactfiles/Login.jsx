// src/reactfiles/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../cssfiles/Auth.css';
import logo from '../images/logo.png';
import books from '../images/books.png';

function Login() {
  const [form, setForm] = useState({
    identifier: '',
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
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
        credentials: 'include'
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.status === 200) {
        localStorage.setItem('accessToken', data.accessToken); // Store the token in localStorage
        setForm({
          identifier: '',
          password: ''
        });
        navigate('/profile'); // Redirect to the profile page after successful login
      }
    } catch (error) {
      setMessage('Error occurred during login');
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
            <label htmlFor="identifier">E-mail or Username</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={form.identifier}
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
          <button type="submit">Login</button>
          {message && <p>{message}</p>}
          <p>Don't have an account? <Link to="/signup">Signup</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Login;
