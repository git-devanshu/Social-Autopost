const express = require('express');
const authRouter = express.Router();
const {login, signup, resetPassword, getVfCode, verifyVfCode} = require('../controllers/authController');

// endpoint prefix : /auth

authRouter.post('/login', login);
authRouter.post('/signup', signup);
authRouter.post('/get-vfcode', getVfCode);
authRouter.post('/verify-vfcode', verifyVfCode);
authRouter.post('/reset-password', resetPassword);

module.exports = {authRouter};