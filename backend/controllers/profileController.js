const {AccessToken} = require("../models/accessTokenModel");
const {Users} = require('../models/userModel');
const {encryptData, decryptData} = require('../utils/helperFunctions');

require('dotenv').config();

// @desc   - Get the OAuth and profile connection data of user
// @route  - GET /oauth/profile-connection
// @access - Private
const getProfileConnectionData = async(req, res) =>{
    try{
        let profileConnection = {
            instagram: false,
            facebook: false,
            linkedin: false,
            twitter: false,
            igUsername : '',
            fbName : '',
            ldnName : '',
            xUsername : ''
        }
        const userId = req.id;

        //check validity of linkedIn token
        const linkedinToken = await AccessToken.findOne({userId, platform: "linkedin"});
        if(linkedinToken && Date.now() < new Date(linkedinToken.expiresAt).getTime()){
            profileConnection.linkedin = true;
            profileConnection.ldnName = linkedinToken.name;
        }

        // Check validity of Twitter token
        const twitterToken = await AccessToken.findOne({ userId, platform: "twitter" });
        if(twitterToken && Date.now() < new Date(twitterToken.expiresAt).getTime()){
            profileConnection.twitter = true;
            profileConnection.xUsername = twitterToken.name;
        }

        // Check validity of Instagram token
        const instagramToken = await AccessToken.findOne({ userId, platform: "instagram" });
        if(instagramToken && Date.now() < new Date(instagramToken.expiresAt).getTime()){
            profileConnection.instagram = true;
            profileConnection.igUsername = instagramToken.name;
        }

        // Check validity of Facebook token
        const facebookToken = await AccessToken.findOne({ userId, platform: "facebook" });
        if(facebookToken && Date.now() < new Date(facebookToken.expiresAt).getTime()){
            profileConnection.facebook = true;
            profileConnection.fbName = facebookToken.name;
        }

        res.status(200).json({message : "Connection data fetched", profileConnection})
    }
    catch(error){
        res.status(500).json({message : "Internal Server Error"});
    }
}


// @desc   - Add the facebook developer APP ID and SECRET into the user db in an encrypted form
// @route  - POST /oauth/facebook/app/add
// @access - Private
const addFBAppDetails = async(req, res) =>{
    try{
        const {fbAppId, fbAppSecret} = req.body;
        const encryptedAppId = encryptData(fbAppId);
        const encryptedAppSecret = encryptData(fbAppSecret);

        const user = await Users.findByIdAndUpdate(req.id, {
            fbAppId : encryptedAppId, 
            fbAppSecret : encryptedAppSecret
        }, {new : true});

        if(!user){
            return res.status(404).json({ message : "User not found" });
        }
        res.status(200).json({ message : "Facebook App credentials added successfully" });
    }
    catch(error){
        res.status(500).json({ message : "Internal Server Error" });
    }
}


// @desc   - Get the facebook developer APP ID from the user db (dont send app secret)
// @route  - GET /oauth/facebook/app
// @access - Private
const getFBAppID = async(req, res) =>{
    try{
        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }
        if(user.fbAppId === ""){
            return res.status(200).json({fbAppId : ""});
        }

        const fbAppId = decryptData(user.fbAppId);
        res.status(200).json({fbAppId});
    }
    catch(error){
        res.status(500).json({ message : "Internal Server Error" });
    }
}


// @desc   - Remove the facebook developer APP ID and SECRET from the user db
// @route  - DELETE /oauth/facebook/app/remove
// @access - Private
const removeFBAppDetails = async(req, res) =>{
    try{
        const user = await Users.findByIdAndUpdate(req.id, {fbAppId : '', fbAppSecret : ''}, {new : true});
        if(!user){
            return res.status(404).json({ message : "User not found" });
        }
        res.status(200).json({ message : "Facebook App credentials removed successfully" });
    }
    catch(error){
        res.status(500).json({ message : "Internal Server Error" });
    }
}


// @desc   - Remove the document from access token collection
// @route  - DELETE /oauth/logout/:platform
// @access - Private
const removeAccessToken = async(req, res) =>{
    try{
        const {platform} = req.params;
        const data = await AccessToken.findOneAndDelete({userId : req.id, platform});
        if(data){
            return res.status(200).json({ message : "Profile Disconnected Successfully" });
        }
        res.status(404).json({ message : "Profile is already disconnected" });
    }
    catch(error){
        res.status(500).josn({ message : "Internal Servere Error" });
    }
}


module.exports = {
    getProfileConnectionData,
    removeAccessToken,
    addFBAppDetails,
    getFBAppID,
    removeFBAppDetails
};