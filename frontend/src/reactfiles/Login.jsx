import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../cssfiles/Auth.css';

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email or Username:</label>
          <input type="text" name="identifier" value={form.identifier} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <p>Don't have an account? <Link to="/signup">Signup</Link></p>
    </div>
  );
}

export default Login;
