const {History} = require('../models/historyModel');

// function to add a record to history while post is successful
const addRecordToHistory = async(userId, platform, accountName, caption, mediaType, mediaURL) =>{
    try{
        if(!mediaURL || mediaURL === null){
            mediaType = "None";
            mediaURL = '';
        }
        const record = new History({
            userId,
            platform,
            accountName,
            caption,
            mediaType,
            mediaURL
        });
        await record.save();
    }
    catch(error){
        throw new Error("Error adding record to History");
    }
}

// @desc   - Get the data of users upload history (in oldest first order)
// @route  - GET /history/get
// @access - Private
const getUploadHistory = async(req, res) =>{
    try{
        const data = await History.find({userId : req.id});
        res.status(200).json(data);
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
        const {id} = req.params;
        const record = await History.findByIdAndDelete(id);
        if(!record){
            return res.status(404).json({ message : "Record not found" });
        }
        res.status(200).json({ message : "Record removed successfully" });
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