const express = require('express');
const router = express.Router();
const { verifySignUp } = require('../middlewares');  // Correct import for middlewares
const controller = require('../controllers/auth.controller');  // Correct import for controller

router.post('/auth/signup', [verifySignUp.checkDuplicateUsernameOrEmail], controller.signup);

module.exports = router;
