const {AccessToken} = require('../models/accessTokenModel');
const {registerMediaOnLinkedIn, registerMediaOnTwitter} = require('../utils/registerMediaToPlatform');
const {addRecordToHistory} = require('../controllers/historyController');

const axios = require("axios");
const {TwitterApi} = require('twitter-api-v2');
const { transcodeVideo } = require('../utils/transcodeVideo');
const { uploadVideoToCloudinary } = require('../utils/uploadToCloudinary');

require('dotenv').config();


// @desc   - Upload the post to Facebook
// @route  - POST /upload/facebook
// @access - Private
const postToFacebook = async (req, res) => {
    try{
        const {caption, mediaURL, mediaType} = req.body;
        const userId = req.id;
        const tokenData = await AccessToken.findOne({ userId, platform: "facebook" });

        if(!tokenData || Date.now() >= new Date(tokenData.expiresAt).getTime()) {
            return res.status(401).json({ message: "Your Facebook profile is not connected" });
        }

        if(!mediaURL){
            await axios.post(`https://graph.facebook.com/v19.0/${tokenData.profileId}/feed`, {
                message: caption,
                access_token: tokenData.token
            });
        }
        else if(mediaType === 'image'){
            await axios.post(`https://graph.facebook.com/v19.0/${tokenData.profileId}/photos`, {
                url: mediaURL,
                caption: caption,
                published: true,
                access_token: tokenData.token
            });
        }
        else if(mediaType === 'video'){
            await axios.post(`https://graph.facebook.com/v19.0/${tokenData.profileId}/videos`, {
                file_url: mediaURL,
                description: caption,
                access_token: tokenData.token
            });
        }

        await addRecordToHistory(userId, 'facebook', tokenData.name, caption, mediaType, mediaURL);
        res.status(200).json({ message: "Facebook post created successfully" });
    }
    catch(error){
        console.error("Facebook posting error:", error.response?.data || error);
        res.status(500).json({message: "Internal Server Error"});
    }
};


// @desc   - Upload the post to Instagram
// @route  - POST /upload/instagram
// @access - Private
const postToInstagram = async (req, res) => {
    try{
        const {caption, mediaURL, mediaType} = req.body;
        const userId = req.id;

        if(!mediaURL){
            return res.status(400).json({ message: "Media is required to post on Instagram" });
        }

        const tokenData = await AccessToken.findOne({ userId, platform: "instagram" });
        if(!tokenData || !tokenData.profileId || Date.now() >= new Date(tokenData.expiresAt).getTime()){
            return res.status(401).json({ message: "Instagram profile not connected" });
        }

        let mediaResponse;
        if(mediaType === "image"){
            mediaResponse = await axios.post(`https://graph.facebook.com/v19.0/${tokenData.profileId}/media`, {
                image_url: mediaURL,
                caption: caption,
                access_token: tokenData.token
            });
        }
        else if(mediaType === "video"){
            const response = await axios.get(mediaURL, { responseType: 'arraybuffer' });
            const inputBuffer = Buffer.from(response.data);
            const outputBuffer = await transcodeVideo(inputBuffer);
            const newMediaURL = await uploadVideoToCloudinary(outputBuffer);

            mediaResponse = await axios.post(`https://graph.facebook.com/v22.0/${tokenData.profileId}/media`, {
                media_type: "REELS",
                video_url: newMediaURL,
                caption: caption,
                share_to_feed: true,
                thumb_offset: "00:00:01.000",
                access_token: tokenData.token
            });

            const creationId = mediaResponse.data.id;

            let status = "";
            let attempts = 0;
            const maxAttempts = 30;
            do{
                await new Promise(r => setTimeout(r, 10000));
                const statusResponse = await axios.get(`https://graph.facebook.com/v19.0/${creationId}?fields=status_code,status`,
                    { params: { access_token: tokenData.token } }
                );
                status = statusResponse.data.status_code;
                console.log(`Attempt ${++attempts}: ${status}`);
            }while(status === "IN_PROGRESS" && attempts < maxAttempts);

            if(status !== "FINISHED"){
                console.error("Final status:", status);
                return res.status(500).json({ message: "Failed to process the video", error: "Timeout" });
            }
        }
        else{
            return res.status(400).json({ message: "Unsupported media type" });
        }

        await axios.post(`https://graph.facebook.com/v19.0/${tokenData.profileId}/media_publish`, {
            creation_id: mediaResponse.data.id,
            access_token: tokenData.token
        });

        await addRecordToHistory(userId, 'instagram', tokenData.name, caption, mediaType, mediaURL);
        res.status(200).json({message: "Posted on Instagram successfully"});
    } catch (error) {
        console.error("Instagram posting error:", error.response?.data || error);
        res.status(500).json({ message: "Failed to post on Instagram" });
    }
};



// @desc   - Upload the post to LinkedIn Account
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
            mediaType = mediaType.toUpperCase();
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
                    }] : []
                }
            },
            visibility: {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
            }
        };

        await axios.post("https://api.linkedin.com/v2/ugcPosts", postPayload, {
            headers: {
                Authorization : `Bearer ${tokenData.token}`,
                "X-Restli-Protocol-Version" : "2.0.0",
                "Content-Type" : "application/json",
            }
        });

        await addRecordToHistory(userId, 'linkedin', tokenData.name, caption, mediaType, mediaURL);
        res.status(200).json({ message: "Posted to LinkedIn successfully" });
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

        await addRecordToHistory(userId, 'twitter', tokenData.name, caption, mediaType, mediaURL);
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