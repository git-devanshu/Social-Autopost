const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, required : true},
    platform : {type : String, required : true, enum : ['linkedin', 'instagram', 'facebook', 'twitter'],},
    token : {type : String, required : true}, //original access token
    profileId : {type : String, required : true},
    issuedAt : {type : Date, required : true},
    validityDuration : {type : Number, required : true}, //in seconds
    expiresAt : {type : Date, required : true}, //calculated at the time of storing token
    tokenSecret : {type : String}, //for twitter
    name : {type : String, default : ''}, //for twitter
});

const AccessToken = mongoose.model('accesstokens', tokenSchema, 'accesstokens');

module.exports = {AccessToken};

/*

profileId
- linkedIn : sub field returned in profile data
- twitter : user_id field returned in profile data
- facebook : pageId of the facebook page
- instagram : igUserId returned in profile data

*/