const express = require('express');
const router = express.Router();
const { signup, login, getMe, validateSignup, validateLogin } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/me', auth, getMe);

module.exports = router;