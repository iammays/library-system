import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CIcon } from '@coreui/icons-react';
import { cilAccountLogout } from '@coreui/icons';
import defaultProfilePic from '../images/profile.jpg';
import logo from '../images/logo.png';
import '../cssfiles/Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="left-section">
        <img src={logo} alt="Logo" />
        <Link to="/profile" className="profile-button">Profile</Link>
        <Link to="/books" className="books-button">Books</Link>
        <Link to="/categories" className="categories-button">Categories</Link>
        <Link to="/students" className="students-button">Students</Link>
      </div>
      <div className="right-section">
        <img src={user ? user.profile_pic : defaultProfilePic} alt="Profile" />
        <div className="user-info">
          <div>{user && user.name}</div>
          <div className="username">@{user && user.username}</div>
        </div>
        <CIcon icon={cilAccountLogout} className="logout-icon" size="sm" onClick={handleLogout} />
      </div>
    </nav>
  );
}

export default Navbar;
