const mongoose = require('mongoose');
const { getCurrentDate } = require('../utils/helperFunctions');

const historySchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, required : true},
    platform : {type : String, required : true, enum : ['linkedin', 'instagram', 'facebook', 'twitter']},
    accountName : {type : String, default : ''}, //account name or username from which the post was uploaded
    caption : {type : String, required : true},
    mediaType : {type : String, required : true},
    mediaURL : {type : String, required : true},
    uploadDate : {type : String, default : getCurrentDate(2)}, //synced with database location's date
    uploadTime : {type : String, default : getCurrentDate(5)} //synced with database location's time
});

const History = mongoose.model('history', historySchema, 'history');

module.exports = {History};