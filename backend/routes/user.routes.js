const { authJwt } = require('../middlewares');
const controller = require('../controllers/user.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set your destination for uploaded files

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get("/api/user/profile", [authJwt.verifyToken], controller.getProfile);

  // Ensure multer is used for file uploads
  app.put("/api/user/profile", [authJwt.verifyToken, upload.single('profile_pic')], controller.updateProfile);
};
