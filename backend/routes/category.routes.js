// routes/category.routes.js
const { authJwt } = require('../middlewares');
const controller = require('../controllers/category.controller');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'Authorization, Origin, Content-Type, Accept'
      );
    next();
  });

  app.post('/api/categories', [authJwt.verifyToken], controller.addCategory);
  app.get('/api/categories', [authJwt.verifyToken], controller.getCategories);
};
