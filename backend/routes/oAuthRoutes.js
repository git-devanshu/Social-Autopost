const express = require('express');
const oAuthRouter = express.Router();
const {handleLinkedInCallback, handleFacebookCallback, handleTwitterCallback, getTwitterOAuthToken, requestTwitterOAuthToken, connectInstagramFromFB} = require('../controllers/oAuthController');
const {getProfileConnectionData, removeAccessToken, addFBAppDetails, getFBAppID, removeFBAppDetails, saveAccessToken} = require('../controllers/profileController');
const {checkAuthorization} = require('../middlewares/checkAuth');

// endpoint prefix : /oauth

oAuthRouter.get('/profile-connection', checkAuthorization, getProfileConnectionData);
oAuthRouter.delete('/logout/:platform', checkAuthorization, removeAccessToken);

oAuthRouter.get('/linkedin/callback', handleLinkedInCallback);

oAuthRouter.post('/twitter/request-token', checkAuthorization, requestTwitterOAuthToken);
oAuthRouter.get('/twitter/callback', handleTwitterCallback);
oAuthRouter.post('/twitter/get-token', checkAuthorization, getTwitterOAuthToken);

oAuthRouter.post('/facebook/app/add', checkAuthorization, addFBAppDetails);
oAuthRouter.get('/facebook/app', checkAuthorization, getFBAppID);
oAuthRouter.delete('/facebook/app/remove', checkAuthorization, removeFBAppDetails);

oAuthRouter.get('/facebook/callback', handleFacebookCallback);
oAuthRouter.get('/instagram/connect', checkAuthorization, connectInstagramFromFB);

/*-------------------------------------------------------------*/

// For testing purpose only
oAuthRouter.post('/store-token', checkAuthorization, saveAccessToken);

/*-------------------------------------------------------------*/


module.exports = {oAuthRouter};