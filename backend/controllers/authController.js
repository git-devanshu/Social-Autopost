const {Users} = require('../models/userModel');
const bcrypt = require('bcryptjs');
const {sendSignupMail, sendVFCodeMail, generateVerificationCode} = require('../utils/helperFunctions');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// @desc   - register new user and send signup mail
// @route  - POST /auth/signup
// @access - Public
const signup = async (req, res)=> {
    try{
        const {name, email, password} = req.body;
        const user = await Users.findOne({email});
        if(!user){
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new Users({
                name,
                email,
                password: hashedPassword
            });
            await newUser.save();
            sendSignupMail(email, name);
            res.status(201).json({message: 'User created successfully'});
        }
        else{
            res.status(400).json({ message : "Username already exists" });
        }
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - login registered user and issue jwt
// @route  - POST /auth/login
// @access - Public
const login = async (req, res)=> {
    try{
        const {email, password} = req.body;
        const user = await Users.findOne({email});
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                res.status(400).json({ message : 'Invalid password'});
            }
            else{
                const token = jwt.sign({id : user._id, email : user.email, name: user.name}, process.env.JWT_SECRET);
                res.status(200).json({ message : 'Login successful', token});
            }
        }
        else{
            res.status(404).json({ message : 'User not found'});
        }
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - send verification code on registered email id
// @route  - POST /auth/forgot-password
// @access - Public
const forgotPassword = async (req, res)=> {
    try{
        const {email} = req.body;
        const user = await Users.findOne({email});
        if(user){
            user.vfcode = generateVerificationCode(6);
            await user.save();
            sendVFCodeMail(email, vfcode);
            res.status(200).json({ message : 'Verification code sent your email id'});
        }
        else{
            res.status(404).json({ message : 'User not found'});
        }
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - verify the code and set new password
// @route  - POST /auth/reset-password
// @access - Public
const resetPassword = async (req, res)=> {
    try{
        const {vfcode, password, email} = req.body;
        const user = await Users.findOne({email});
        if(user){
            const savedVfCode = user.vfcode;
            if(savedVfCode == vfcode){
                const hashedPass = await bcrypt.hash(password, 10);
                await user.updateOne({password : hashedPass, vfcode : '0'});
                res.status(200).json({ message : 'Password reset successful'});
            }
            else{
                res.status(403).json({ message : 'Invalid verification code'});
            }
        }
        else{
            res.status(404).json({ message : 'User not found'});
        }
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
};