const express = require('express');
const authRouter = express.Router();
const {login, signup, forgotPassword, resetPassword} = require('../controllers/authController');

// endpoint prefix : /auth

authRouter.post('/login', login);
authRouter.post('/signup', signup);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

module.exports = {authRouter};