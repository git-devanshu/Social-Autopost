const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, required : true},
    platform : {type : String, required : true, enum : ['linkedin', 'instagram', 'facebook', 'twitter'],},
    token : {type : String, required : true},
    issuedAt : {type : Date, required : true},
    validityDuration : {type : Number, required : true}, //in seconds or milliseconds
    expiresAt : {type : Date, required : true} //calculated at the time of storing token
});

const AccessToken = mongoose.model('tokens', tokenSchema, 'tokens');

module.exports = {AccessToken};