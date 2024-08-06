import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfilePic from '../images/profile.jpg';
import '../cssfiles/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    profile_pic: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  
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
            password: '',
            profile_pic: data.profile_pic || defaultProfilePic
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

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('username', form.username);
    formData.append('password', form.password);
    if (profilePic) {
      formData.append('profile_pic', profilePic);
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        body: formData
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
      <div className="profile-container">
        {user ? (
          <div>
            <img src={user.profile_pic || defaultProfilePic} alt="Profile" />
            <h2>{user.name}</h2>
            <p>@{user.username}</p>
            <p>{user.email}</p>
            <button onClick={() => setEditMode(true)} className="edit-button">Edit</button>

            {editMode && (
              <div className="modal-overlay">
                <div className="modal">
                  <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
                    <div className="form-group">
                      <label>Profile Picture:</label>
                      <input type="file" name="profile_pic" onChange={handleFileChange} />
                    </div>
                    <div className="form-group">
                      <label>Name:</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Username:</label>
                      <input type="text" name="username" value={form.username} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Email:</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Password:</label>
                      <input type="password" name="password" value={form.password} onChange={handleChange} />
                    </div>
                    <button type="submit" className="save-button">Save</button>
                    <button type="button" onClick={() => setEditMode(false)} className="cancel-button">Cancel</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
