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
  app.get('/api/books/search', [authJwt.verifyToken], controller.searchBooks); // New route for searching and filtering books
};


