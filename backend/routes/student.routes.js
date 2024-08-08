// routes/student.routes.js
const { authJwt } = require('../middlewares');
const controller = require('../controllers/student.controller');
const subscriptionController = require('../controllers/subscription.controller');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
    'Authorization, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post('/api/students', [authJwt.verifyToken], controller.addStudent);
  app.get('/api/students', [authJwt.verifyToken], controller.getStudents);
  app.get('/api/students/search', [authJwt.verifyToken], controller.searchStudents);
  app.get('/api/students/:studentId', [authJwt.verifyToken], controller.getStudentDetails);
  app.post('/api/subscriptions', [authJwt.verifyToken], subscriptionController.addSubscription);
  app.put('/api/subscriptions', [authJwt.verifyToken], subscriptionController.updateSubscription);
  app.get('/api/subscriptions/:studentId/status', [authJwt.verifyToken], subscriptionController.getSubscriptionStatus);
};
