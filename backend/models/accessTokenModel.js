const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, required : true},
    platform : {type : String, required : true, enum : ['linkedin', 'instagram', 'facebook', 'twitter'],},
    token : {type : String, required : true}, //original access token
    profileId : {type : String, required : true},
    issuedAt : {type : Date, required : true},
    validityDuration : {type : Number, required : true}, //in seconds
    expiresAt : {type : Date, required : true}, //calculated at the time of storing token
    tokenSecret : {type : String}, //access token secret (required for twitter)
    ldnPageInfo : {type : Object}, //connected page info (required for linkedin)
    name : {type : String, default : ''},
});

const AccessToken = mongoose.model('accesstokens', tokenSchema, 'accesstokens');

module.exports = {AccessToken};

/*

profileId
- linkedIn : sub field returned in profile data
- twitter : user_id field returned in profile data
- facebook : pageId of the facebook page
- instagram : igUserId returned in profile data

name
- linkedIn : profile name
- twitter : profile username
- facebook : name of facebook page
- instagram : profile username

*/