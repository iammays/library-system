// models/book.model.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  status: { type: String, enum: ['available', 'borrowed'], required: true },
  cover: { type: String }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
