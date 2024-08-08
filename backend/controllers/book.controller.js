// controllers/book.controller.js
const db = require('../models');
const Book = db.book;
const Category = db.category;
const Student = db.student;
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

// new

//Lends a book to a student.
exports.lendBook = async (req, res) => {
  try {
    const { studentId, bookId } = req.body;

    // ابحث عن الطالب واسترجع بيانات الاشتراك
    const student = await Student.findOne({ studentId }).populate('subscription');
    if (!student) {
      return res.status(404).send({ message: 'Student not found!' });
    }

    // تحقق من حالة الدفع في الاشتراك
    const subscription = student.subscription;
    if (!subscription || subscription.paymentStatus !== 'paid') {
      return res.status(403).send({ message: 'Student must pay subscription fee to borrow books!' });
    }

    // تحقق من توفر الكتاب
    const book = await Book.findById(bookId);
    if (!book || book.status !== 'available') {
      return res.status(400).send({ message: 'Book is not available!' });
    }

    // قم بتحديث حالة الكتاب إلى "مستعار"
    book.status = 'borrowed';
    book.borrowedBy = student._id;
    book.borrowedDate = new Date();
    await book.save();

    res.status(200).send({ message: 'Book borrowed successfully!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};




//Returns a borrowed book.
exports.returnBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.status !== 'borrowed') {
      return res.status(400).send({ message: 'Book is not borrowed!' });
    }

    book.status = 'available';
    book.borrowedBy = null;
    book.borrowedDate = null;
    await book.save();

    res.status(200).send({ message: 'Book returned successfully!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//Retrieves all available books from the database.
exports.getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({ status: 'available' }).populate('category', 'name');
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//Searches for available books based on title, author, and/or category.
exports.searchAvailableBooks = async (req, res) => {
  try {
    const { title, author, category } = req.query;
    let filter = { status: 'available' };

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }

    const books = await Book.find(filter).populate('category', 'name');
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};



//Retrieves all borrowed books by a specific student.
exports.getBorrowedBooksByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).send({ message: 'Student not found!' });
    }

    
    const borrowedBooks = await Book.find({ borrowedBy: student._id }).populate('category', 'name');
    
    res.status(200).send(borrowedBooks);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//Retrieves all borrowed books from the database.
exports.getBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await Book.find({ status: 'borrowed' }).populate('category', 'name').populate('borrowedBy', 'name studentId');
    res.status(200).send(borrowedBooks);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//Searches for borrowed books based on title, author, category, and/or student ID.
exports.searchBorrowedBooks = async (req, res) => {
  try {
    const { title, author, category, studentId } = req.query;
    let filter = { status: 'borrowed' };

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (studentId) {
      const student = await Student.findOne({ studentId });
      if (student) {
        filter.borrowedBy = student._id;
      } else {
        return res.status(404).send({ message: 'Student not found!' });
      }
    }

    const books = await Book.find(filter).populate('category', 'name').populate('borrowedBy', 'name studentId');
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//Retrieves books that have been borrowed for more than 7 days.
exports.getOverdueBooks = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const overdueBooks = await Book.find({ 
      status: 'borrowed', 
      borrowedDate: { $lt: sevenDaysAgo } 
    }).populate('borrowedBy', 'name studentId');

    if (overdueBooks.length === 0) {
      return res.status(200).send({ message: 'No overdue books found!' });
    }

    res.status(200).send(overdueBooks);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//Searches for borrowed books by a specific student based on title.
exports.searchBorrowedBooksByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { title } = req.query;

    // Find the student by studentId
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).send({ message: 'Student not found!' });
    }

    // Construct filter for searching borrowed books
    let filter = { borrowedBy: student._id, status: 'borrowed' };

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    // Find books borrowed by the student that match the search criteria
    const borrowedBooks = await Book.find(filter).populate('category', 'name');

    res.status(200).send(borrowedBooks);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

