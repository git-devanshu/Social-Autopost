const {AccessToken} = require("../models/accessTokenModel");
const {Users} = require('../models/userModel');
const {encryptData, decryptData} = require('../utils/helperFunctions');

const axios = require("axios");
const querystring = require("querystring");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");
const { access } = require("fs");

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


// @desc   - Handle linkedIn OAuth callback and store the access token in db
// @route  - GET /oauth/linkedin/callback
// @access - Callback & Public
const handleLinkedInCallback = async(req, res) =>{
    try{
        const {code, state: userId} = req.query;
        const REDIRECT_URI = `${req.protocol}://${req.get('host')}/oauth/linkedin/callback`;

        const tokenResponse = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", querystring.stringify({
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const accessToken = tokenResponse.data.access_token;
        const expiresIn = tokenResponse.data.expires_in;

        const profileResponse = await axios.get("https://api.linkedin.com/v2/userinfo", { headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        await AccessToken.findOneAndUpdate({ userId, platform: "linkedin" }, {
            token: accessToken,
            profileId: profileResponse.data.sub,
            platform: "linkedin",
            issuedAt: new Date(),
            validityDuration: expiresIn,
            expiresAt: new Date(Date.now() + expiresIn * 1000),
            name: profileResponse.data.name
        }, { 
            upsert: true, new: true 
        });

        const successClientURL = `${process.env.CLIENT_URL}?success=true`
        res.redirect(successClientURL);
    }
    catch(error){
        console.error("Error during LinkedIn OAuth:", error.response?.data || error);
        const errorClientURL = `${process.env.CLIENT_URL}?error=oauth_failed`
        res.redirect(errorClientURL);
    }
};


// @desc   - Get the twitter oauth token from twitter
// @route  - POST /oauth/twitter/request-token
// @access - Private
const requestTwitterOAuthToken = async (req, res) => {
    try{
        const oauth = OAuth({
            consumer: {
                key: process.env.TWITTER_CONSUMER_KEY,
                secret: process.env.TWITTER_CONSUMER_SECRET,
            },
            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return crypto
                    .createHmac("sha1", key)
                    .update(base_string)
                    .digest("base64");
            },
        });

        const REDIRECT_URI = `${req.protocol}://${req.get('host')}/oauth/twitter/callback`;
        const requestData = {
            url: "https://api.twitter.com/oauth/request_token",
            method: "POST",
            data: {
                oauth_callback: REDIRECT_URI,
            },
        };

        const authHeader = oauth.toHeader(oauth.authorize(requestData));
        const tokenResponse = await axios.post("https://api.twitter.com/oauth/request_token", {}, { headers: {
                Authorization: authHeader.Authorization,
            },
        });

        const params = new URLSearchParams(tokenResponse.data);
        const oauth_token = params.get("oauth_token");
        const oauth_token_secret = params.get("oauth_token_secret");

        if(!oauth_token || !oauth_token_secret){
            throw new Error("Failed to get request token.");
        }

        await Users.findByIdAndUpdate(req.id, {
            xOAuthTokenSecret : oauth_token_secret
        });
        res.status(200).json({oauth_token});
    }
    catch (error) {
        console.error("Error getting request token:", error.response?.data || error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// @desc   - Handle Twitter OAuth callback and send the oauth token and oauth verifier to frontend in query params
// @route  - GET /oauth/twitter/callback
// @access - Callback & Public
const handleTwitterCallback = async (req, res) => {
    try{
        const {oauth_token, oauth_verifier} = req.query;
        if (!oauth_token || !oauth_verifier) {
            throw new Error("Invalid OAuth response from Twitter.");
        }

        const successClientURL = `${process.env.CLIENT_URL}?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`;
        res.redirect(successClientURL);
    }
    catch(error){
        console.error("Error during Twitter OAuth callback:", error.response?.data || error);
        const errorClientURL = `${process.env.CLIENT_URL}?error=oauth_failed`;
        res.redirect(errorClientURL);
    }
};


// @desc   - Gets the code and code verifier and stores the access token and access token secret in db
// @route  - POST /oauth/twitter/get-token
// @access - Private
const getTwitterOAuthToken = async (req, res) => {
    try {
        const {oauth_token, oauth_verifier} = req.body;
        const userId = req.id;

        const oauth = OAuth({
            consumer: {
                key: process.env.TWITTER_CONSUMER_KEY,
                secret: process.env.TWITTER_CONSUMER_SECRET,
            },
            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return crypto
                    .createHmac("sha1", key)
                    .update(base_string)
                    .digest("base64");
            },
        });

        const requestData = {
            url: "https://api.twitter.com/oauth/access_token",
            method: "POST",
            data: {
                oauth_verifier,
            },
        };

        const userData = await Users.findById(userId);
        const authHeader = oauth.toHeader(oauth.authorize(requestData, {
            key: oauth_token,
            secret: userData.xOAuthTokenSecret
        }));

        const tokenResponse = await axios.post("https://api.twitter.com/oauth/access_token", new URLSearchParams({ oauth_token, oauth_verifier }).toString(), {headers: { 
                Authorization: authHeader.Authorization,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const params = new URLSearchParams(tokenResponse.data);
        const accessToken = params.get("oauth_token");
        const accessTokenSecret = params.get("oauth_token_secret");
        const userIdTwitter = params.get("user_id");
        const screenName = params.get("screen_name");

        const customValidityPeriod = 60 * 24 * 60 * 60;
        await AccessToken.findOneAndUpdate({userId, platform: "twitter"}, {
            userId,
            token: accessToken,
            tokenSecret: accessTokenSecret,
            profileId: userIdTwitter,
            platform: "twitter",
            issuedAt: new Date(),
            name: screenName,
            validityDuration : customValidityPeriod,
            expiresAt: new Date(Date.now() + customValidityPeriod * 1000)
        }, {
            upsert: true, new: true
        });

        res.status(200).json({ message: "Profile Connected Successfully" });
    }
    catch(error){
        console.error("Error getting access token:", error.response?.data || error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


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


// @desc   - Handle Facebook OAuth callback and store the access token in db
// @route  - GET /oauth/facebook/callback
// @access - Callback & Public
const handleFacebookCallback = async(req, res) => {
    try{
        const {code, userId} = req.query;
        if(!code || !userId){
            return res.status(400).json({ message: "Authorization code missing" });
        }

        const savedUser = await Users.findById(userId);
        const fbAppId = decryptData(savedUser.fbAppId);
        const fbAppSecret = decryptData(savedUser.fbAppSecret);

        const REDIRECT_URI = `${req.protocol}://${req.get('host')}/oauth/facebook/callback?userId=${userId}`;
        const tokenResponse = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
            params: {
                client_id: fbAppId,
                client_secret: fbAppSecret,
                redirect_uri: REDIRECT_URI,
                code: code
            }
        });

        const longLivedTokenResponse = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: fbAppId,
                client_secret: fbAppSecret,
                fb_exchange_token: tokenResponse.data.access_token
            }
        });

        const longLivedToken = longLivedTokenResponse.data.access_token;

        const pagesResponse = await axios.get(`https://graph.facebook.com/v19.0/me/accounts`, {
            params: {
                access_token: longLivedToken
            }
        });
        if(!pagesResponse.data.data || pagesResponse.data.data.length === 0){
            return res.status(400).json({ message: "No Facebook Page found for this account" });
        }

        const {id: pageId, name: pageName} = pagesResponse.data.data[0];
        const pageAccessToken = pagesResponse.data.data[0].access_token;

        await AccessToken.findOneAndUpdate({userId, platform: "facebook"}, {
            userId,
            token: pageAccessToken,
            profileId: pageId,
            platform: "facebook",
            validityDuration : 5184000,
            expiresAt: new Date(Date.now() + (5184000000)),
            issuedAt: new Date(),
            name : pageName
        }, {
            upsert: true, new: true
        });

        const successClientURL = `${process.env.CLIENT_URL}?success=true`
        res.redirect(successClientURL);
    }
    catch(error){
        console.error("Error during Facebook OAuth:", error.response?.data || error);
        const errorClientURL = `${process.env.CLIENT_URL}?error=oauth_failed`
        res.redirect(errorClientURL);
    }
};


// @desc   - Connect the linked Instagram account from the already connected FB Page
// @route  - GET /oauth/instagram/connect
// @access - Private
const connectInstagramFromFB = async(req, res) =>{
    try{
        const userId = req.id;
        const fbToken = await AccessToken.findOne({userId, platform : "facebook"});
        if(!fbToken){
            return res.status(400).json({ message: "You need to connect your Facebook Page first"});
        }

        const igAccountResponse = await axios.get(`https://graph.facebook.com/v19.0/${fbToken.profileId}`, {
            params: {
                fields: 'instagram_business_account',
                access_token: fbToken.token
            }
        });

        if(!igAccountResponse.data.instagram_business_account?.id){
            return res.status(400).json({ message: "Your Instagram Business Account is not linked to this Facebook Page" });
        }
        const igUserId = igAccountResponse.data.instagram_business_account.id;

        const igUsernameResponse = await axios.get(`https://graph.facebook.com/v19.0/${igUserId}`, {
            params: {
                fields: 'username',
                access_token: fbToken.token
            }
        });
        const igUsername = igUsernameResponse.data.username;

        const today = new Date();
        const validity = (fbToken.expiresAt - today)/1000;

        await AccessToken.findOneAndUpdate({userId, platform: "instagram"}, {
            userId,
            token: fbToken.token,
            profileId: igUserId,
            platform: "instagram",
            validityDuration : validity,
            expiresAt: fbToken.expiresAt,
            issuedAt: new Date(),
            name : igUsername
        }, {
            upsert: true, new: true
        });

        res.status(200).json({ message : "Profile Connected Successfully" })
    }
    catch(error){
        res.status(500).json({ message : "Profile Authentication Failed" });
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


/*-------------------------------------------------------------*/

// API endpoint to save access token to DB, for testing purpose only

const saveAccessToken = async(req, res) =>{
    try{
        const {platform, accessToken, profileId, name} = req.body;
        userId = req.id;

        const customValidityPeriod = 60 * 24 * 60 * 60;
        await AccessToken.findOneAndUpdate({userId, platform}, {
            userId,
            token: accessToken,
            profileId,
            platform,
            issuedAt: new Date(),
            name,
            validityDuration : customValidityPeriod,
            expiresAt: new Date(Date.now() + customValidityPeriod * 1000)
        }, {
            upsert: true, new: true
        });

        res.status(200).json({ message: "Token stored" });
    }
    catch(error){
        res.status(500).josn({ message : "Internal Servere Error" });
    }
}

/*-------------------------------------------------------------*/


module.exports = {
    getProfileConnectionData,
    removeAccessToken,
    handleLinkedInCallback,
    handleTwitterCallback,
    getTwitterOAuthToken,
    requestTwitterOAuthToken,

    addFBAppDetails,
    getFBAppID,
    removeFBAppDetails,
    handleFacebookCallback,
    connectInstagramFromFB,

    saveAccessToken
};