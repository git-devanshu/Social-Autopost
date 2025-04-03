const {History} = require('../models/historyModel');

// function to add a record to history while post is successful
const addRecordToHistory = async(userId, platform, accountName, caption, mediaType, mediaURL) =>{

}

// @desc   - Get the data of users upload history
// @route  - GET /history/get
// @access - Private
const getUploadHistory = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Internal Server Error" });
    }
}

// @desc   - Remove a record from user's history
// @route  - DELETE /history/remove/:id
// @access - Private
const removeHistoryRecord = async(req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({ message : "Internal Server Error" });
    }
}

module.exports = {
    addRecordToHistory,
    getUploadHistory,
    removeHistoryRecord
}