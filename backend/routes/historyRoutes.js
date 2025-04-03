const express = require('express');
const historyRouter = express.Router();
const {checkAuthorization} = require('../middlewares/checkAuth');
const {getUploadHistory, removeHistoryRecord} = require('../controllers/historyController');

// endpoint prefix : /history

historyRouter.get('/get', checkAuthorization, getUploadHistory);
historyRouter.delete('/remove/:id', checkAuthorization, removeHistoryRecord);

module.exports = {historyRouter};