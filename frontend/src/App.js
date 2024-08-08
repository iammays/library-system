import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './reactfiles/Navbar';
import Profile from './reactfiles/Profile';
import Books from './reactfiles/Books';
import Categories from './reactfiles/Categories';
import Login from './reactfiles/Login';
import Signup from './reactfiles/Signup';
import Students from './reactfiles/Students';
import LendBooks from './reactfiles/LendBooks';
import BorrowedBooks from './reactfiles/BorrowedBooks';
import Fees from './reactfiles/Fees';

const App = () => {
  const location = useLocation();
  const noNavbarRoutes = ['/login', '/signup'];

  return (
    <div className="App">
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/books" element={<Books />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/students" element={<Students />} />
        <Route path="/lend" element={<LendBooks />} />
        <Route path="/borrowed-books" element={<BorrowedBooks />} />
        <Route path="/fees" element={<Fees />} />
      </Routes>
    </div>
  );
};

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
