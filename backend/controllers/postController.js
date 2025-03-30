const {AccessToken} = require('../models/accessTokenModel');
const {registerMediaOnLinkedIn, registerMediaOnTwitter} = require('../utils/registerMediaToPlatform');

const axios = require("axios");
const querystring = require("querystring");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");
const { TwitterApi } = require('twitter-api-v2');

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


// @desc   - Upload the post to LinkedIn (Can upload only image or text)
// @route  - POST /upload/linkedin
// @access - Private
const postToLinkedIn = async (req, res) => {
    try{
        let {caption, mediaURL, mediaType} = req.body;
        const userId = req.id;
        const tokenData = await AccessToken.findOne({userId, platform: "linkedin"});

        if(!tokenData || Date.now() >= new Date(tokenData.expiresAt).getTime()){
            return res.status(401).json({ message : "Your LinkedIn profile is not conected" });
        }

        let assetURN = null;
        if(!mediaURL){
            mediaType = "NONE";
        } 
        else{
            mediaType = mediaType === "image" ? "IMAGE" : "VIDEO";
            assetURN = await registerMediaOnLinkedIn(mediaType, mediaURL, tokenData);
        }

        const postPayload = {
            author: `urn:li:person:${tokenData.profileId}`,
            lifecycleState: "PUBLISHED",
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    shareCommentary: {
                        text: caption,
                    },
                    shareMediaCategory: mediaType,
                    media: assetURN ? [{
                        status: "READY",
                        description: {
                            text: "Media description",
                        },
                        media: assetURN,
                        title: {
                            text: "Post Title",
                        },
                    }] : [],
                }
            },
            visibility: {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
            }
        };

        const response = await axios.post("https://api.linkedin.com/v2/ugcPosts", postPayload, {
                headers: {
                    Authorization : `Bearer ${tokenData.token}`,
                    "X-Restli-Protocol-Version" : "2.0.0",
                    "Content-Type" : "application/json",
                }
            }
        );
        res.status(200).json({ message: "Post uploaded successfully", response: response.data });
    } 
    catch(error){
        console.error("Error posting to LinkedIn:", error.response?.data || error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// @desc   - Upload the post to Twitter
// @route  - POST /upload/twitter
// @access - Private
const postToTwitter = async (req, res) => {
    try{
        const {caption, mediaURL, mediaType} = req.body;
        const userId = req.id;
        const tokenData = await AccessToken.findOne({ userId, platform: "twitter" });

        if(!tokenData || Date.now() >= new Date(tokenData.expiresAt).getTime()){
            return res.status(401).json({ message : "Your Twitter(X) profile is not conected" });
        }

        if(mediaType === 'video'){
            return res.status(400).json({ message : "Video uploads are not supported for Twitter(X)" });
        }

        const twitterClient = new TwitterApi({
            appKey: process.env.TWITTER_CONSUMER_KEY,
            appSecret: process.env.TWITTER_CONSUMER_SECRET,
            accessToken: tokenData.token,
            accessSecret: tokenData.tokenSecret,
        });

        let mediaId = null;
        if(mediaURL){
            mediaId = await registerMediaOnTwitter(mediaURL, mediaType, tokenData);
        }

        const tweetPayload = {
            text: caption,
            ...(mediaId && { media: { media_ids: [mediaId] }})
        };
        const response = await twitterClient.v2.tweet(tweetPayload);

        res.status(200).json({ message: "Tweet posted successfully", tweet: response.data });
    } 
    catch(error){
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = {
    postToFacebook,
    postToInstagram,
    postToLinkedIn,
    postToTwitter
};