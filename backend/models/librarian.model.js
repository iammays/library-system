const mongoose = require('mongoose');

const librarianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_pic: { type: String, default: 'frontend/src/images/profile.jpg' } 
});

const Librarian = mongoose.model('Librarian', librarianSchema);

module.exports = Librarian;
