const express = require('express');
const authCheck = require('../../middlewares/authCheck');
const userController = require('../../controllers/user');
const router = express.Router();

// user route to register
router.post('/register', userController.register);

// user route to login
router.post('/login', userController.login);

module.exports = router;