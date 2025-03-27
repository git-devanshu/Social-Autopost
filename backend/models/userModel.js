const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    vfcode : {type : String, default : '0'}
});

const Users = mongoose.model('users', userSchema, 'users');

module.exports = {Users};