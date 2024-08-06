// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './reactfiles/Navbar';
import Profile from './reactfiles/Profile';
import Books from './reactfiles/Books';
import Categories from './reactfiles/Categories';
import Login from './reactfiles/Login';
import Signup from './reactfiles/Signup';
import Students from './reactfiles/Students';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/books" element={<Books />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/students" element={<Students />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
