// routes/book.routes.js
const { authJwt } = require('../middlewares');
const controller = require('../controllers/book.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'Authorization, Origin, Content-Type, Accept'
      );
    next();
  });

  app.post('/api/books', [authJwt.verifyToken, upload.single('cover')], controller.addBook);
  app.get('/api/books', [authJwt.verifyToken], controller.getBooks);
  app.get('/api/books/nocover', [authJwt.verifyToken], controller.getBooksNoCover);
  app.get('/api/books/search', [authJwt.verifyToken], controller.searchBooks);
  app.get('/api/books/available', [authJwt.verifyToken], controller.getAvailableBooks);
  app.get('/api/books/search/available', [authJwt.verifyToken], controller.searchAvailableBooks);
  app.post('/api/books/lend', [authJwt.verifyToken], controller.lendBook);
  app.post('/api/books/return', [authJwt.verifyToken], controller.returnBook);
  app.get('/api/books/borrowed/:studentId', [authJwt.verifyToken], controller.getBorrowedBooksByStudent); 
  app.get('/api/books/borrowed', [authJwt.verifyToken], controller.getBorrowedBooks);
  app.get('/api/books/search/borrowed', [authJwt.verifyToken], controller.searchBorrowedBooks);
  app.get('/api/books/overdue', [authJwt.verifyToken], controller.getOverdueBooks); 
  app.get('/api/books/borrowed/:studentId/search', [authJwt.verifyToken], controller.searchBorrowedBooksByStudent);
};
