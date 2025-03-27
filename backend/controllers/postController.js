const {Users} = require('../models/userModel');
const {AccessToken} = require('../models/tokenModel');
require('dotenv').config();

// @desc   - Upload the post to Facebook
// @route  - POST /upload/facebook
// @access - Private
const postToFacebook = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({message : 'Internal Server Error'});
    }
}

// @desc   - Upload the post to Instagram
// @route  - POST /upload/instagram
// @access - Private
const postToInstagram = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({message : 'Internal Server Error'});
    }
}

// @desc   - Upload the post to LinkedIn
// @route  - POST /upload/linkedin
// @access - Private
const postToLinkedIn = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({message : 'Internal Server Error'});
    }
}

// @desc   - Upload the post to Twitter
// @route  - POST /upload/twitter
// @access - Private
const postToTwitter = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({message : 'Internal Server Error'});
    }
}

module.exports = {
    postToFacebook,
    postToInstagram,
    postToLinkedIn,
    postToTwitter
};