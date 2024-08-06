// controllers/book.controller.js
const db = require('../models');
const Book = db.book;
const Category = db.category;
const cloudinary = require('../config/cloudinary.config');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.addBook = async (req, res) => {
    try {
      const { title, author, category, status } = req.body;
      let cover = '';
  
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        cover = result.secure_url;
      }
  
      const categoryExists = await Category.findOne({ name: category });
      if (!categoryExists) {
        return res.status(400).send({ message: 'Category does not exist!' });
      }
  
      const book = new Book({ title, author, category: categoryExists._id, status, cover });
      await book.save();
  
      res.status(201).send({ message: 'Book added successfully!' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  
  exports.getBooks = async (req, res) => {
    try {
      const books = await Book.find().populate('category', 'name');
      res.status(200).send(books);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  
  exports.getBooksNoCover = async (req, res) => {
    try {
      const books = await Book.find().select('-cover').populate('category', 'name');
      res.status(200).send(books);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

exports.searchBooks = async (req, res) => {
  try {
    const { title, author, category } = req.query;
    let filter = {};

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }

    const books = await Book.find(filter);
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
