import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        const data = await response.json();
        if (response.status === 200) {
          setUser(data);
          setForm({
            name: data.name,
            email: data.email,
            username: data.username,
            password: ''
          });
        } else {
          console.error('Error fetching profile:', data.message);
          if (response.status === 403 || response.status === 401) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (response.status === 200) {
        setUser(data);
        setEditMode(false);
      } else {
        console.error('Error updating profile:', data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <Logout />
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Username: <span style={{ fontSize: 'smaller' }}>@{user.username}</span></p>
          <p>Email: {user.email}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>

          {editMode && (
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label>Username:</label>
                <input type="text" name="username" value={form.username} onChange={handleChange} required />
              </div>
              <div>
                <label>Email:</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label>Password:</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} />
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
            </form>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
