const express = require('express');
const oAuthRouter = express.Router();
const {handleLinkedInCallback, getProfileConnectionData, handleFacebookCallback, handleInstagramCallback, handleTwitterCallback, removeAccessToken, getTwitterOAuthToken, requestTwitterOAuthToken, saveAccessToken} = require('../controllers/oAuthController');
const {checkAuthorization} = require('../middlewares/checkAuth');

// endpoint prefix : /oauth

oAuthRouter.get('/profile-connection', checkAuthorization, getProfileConnectionData);

oAuthRouter.get('/linkedin/callback', handleLinkedInCallback);
oAuthRouter.get('/twitter/callback', handleTwitterCallback);
oAuthRouter.get('/instagram/callback', handleInstagramCallback);
oAuthRouter.get('/facebook/callback', handleFacebookCallback);

oAuthRouter.post('/twitter/request-token', checkAuthorization, requestTwitterOAuthToken);
oAuthRouter.post('/twitter/get-token', checkAuthorization, getTwitterOAuthToken);

oAuthRouter.delete('/logout/:platform', checkAuthorization, removeAccessToken);

/*-------------------------------------------------------------*/

// For testing purpose only
oAuthRouter.post('/store-token', checkAuthorization, saveAccessToken);

/*-------------------------------------------------------------*/


module.exports = {oAuthRouter};