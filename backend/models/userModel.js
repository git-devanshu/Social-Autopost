const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    vfcode : {type : String, default : '0'},
    xOAuthTokenSecret : {type : String, default : ''}, //required for twitter only
    fbAppId : {type : String, default : ''}, //required for FB and IG, stored AES-256 encrypted
    fbAppSecret : {type : String, default : ''} //required for FB and IG, stored AES-256 encrypted
});

const Users = mongoose.model('users', userSchema, 'users');

module.exports = {Users};