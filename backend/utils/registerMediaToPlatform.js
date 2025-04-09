const axios = require('axios');
const {get} = require("https");
const crypto = require("crypto");
const OAuth = require("oauth-1.0a");
const FormData = require("form-data");
const fs = require("fs");
const { TwitterApi } = require('twitter-api-v2');
const fileType = require('file-type');

require('dotenv').config();

// function to download media from the public URL
const downloadMedia = async(mediaURL) => {
    return new Promise((resolve, reject) =>{
        get(mediaURL, (response) =>{
            const data = [];
            response.on("data", (chunk) =>{
                data.push(chunk);
            });
            response.on("end", () =>{
                resolve(Buffer.concat(data));
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
};

// function to register the media on linkedIn registry for user and get the assetURN
const registerMediaOnLinkedIn = async(mediaType, mediaURL, tokenData) =>{
    try{
        const recipe = mediaType === "IMAGE" ? "urn:li:digitalmediaRecipe:feedshare-image" : "urn:li:digitalmediaRecipe:feedshare-video";
        
        const registerUpload = await axios.post("https://api.linkedin.com/v2/assets?action=registerUpload", {
                registerUploadRequest: {
                    recipes: [recipe],
                    owner: `urn:li:person:${tokenData.profileId}`,
                    serviceRelationships: [
                        {
                            relationshipType: "OWNER",
                            identifier: "urn:li:userGeneratedContent",
                        },
                    ],
                },
            }, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                    "X-Restli-Protocol-Version": "2.0.0",
                    "Content-Type": "application/json",
                },
            }
        );

        const uploadURL = registerUpload.data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
        const assetURN = registerUpload.data.value.asset;

        const mediaBuffer = await downloadMedia(mediaURL);
        await axios.put(uploadURL, mediaBuffer, {
            headers: {
                Authorization: `Bearer ${tokenData.token}`,
                "Content-Type": mediaType === "IMAGE" ? "image/png" : "video/mp4",
            },
        });
        
        return assetURN;
    }
    catch(error){
        console.log(error);
        throw new Error('Failed to register media on LinkedIn');
    }
}

// Function to upload media to Twitter and get media_id
const registerMediaOnTwitter = async (imageURL, mediaType, tokenData) => {
    try{
        if(mediaType === 'video'){
            throw new Error("Video uploads not supported");
        }
        if(!imageURL || imageURL === null){
            throw new Error("Media URL is required");
        }

        const response = await axios.get(imageURL, {
            responseType: 'arraybuffer',
            timeout: 15000,
            headers: {
                'User-Agent': 'TwitterMediaUploader/1.0',
                'Accept': 'image/*'
            },
            validateStatus: (status) => status === 200
        });

        if(!response.data){
            throw new Error('Empty response data from image URL');
        }

        const imageBuffer = Buffer.from(response.data);
        if(imageBuffer.length < 1000){
            throw new Error('Image file too small (possibly corrupted)');
        }

        const client = new TwitterApi({
            appKey: process.env.TWITTER_CONSUMER_KEY || '',
            appSecret: process.env.TWITTER_CONSUMER_SECRET || '',
            accessToken: tokenData.token || '',
            accessSecret: tokenData.tokenSecret || ''
        });

        const mediaId = await safeUploadMedia(client, imageBuffer);
        return mediaId;

    }
    catch(error){
        console.error('IMAGE UPLOAD FAILURE DETAILS:', error.message);
        throw new Error('Failed to upload the image on Twitter(X)');
    }
};

const safeUploadMedia = async (client, buffer) => {
    try{
        const mediaId = await client.v1.uploadMedia(buffer, {
            mimeType: 'image/jpeg',
            target: 'tweet'
        });
        return mediaId;
    } 
    catch(error){
        try{
            const mediaId = await client.v2.uploadMedia(buffer, {
                mimeType: 'image/jpeg',
                mediaCategory: 'tweet_image'
            });
            return mediaId;
        } 
        catch(fallbackError){
            console.error('FALLBACK UPLOAD FAILED:', fallbackError);
            throw new Error('Failed to upload the image on Twitter(X)');
        }
    }
};

module.exports = {
    registerMediaOnLinkedIn,
    registerMediaOnTwitter
};