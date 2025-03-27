const express = require('express');
const postRouter = express.Router();
const {postToFacebook, postToLinkedIn, postToInstagram, postToTwitter} = require('../controllers/postController');
const {checkAuthorization} = require('../middlewares/checkAuth');

// endpoint prefix : /upload

postRouter.post('/facebook', checkAuthorization, postToFacebook);
postRouter.post('/instagram', checkAuthorization, postToInstagram);
postRouter.post('/linkedin', checkAuthorization, postToLinkedIn);
postRouter.post('/twitter', checkAuthorization, postToTwitter);

module.exports = {postRouter};