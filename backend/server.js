const express = require('express');
const cors = require('cors');
const path = require('path');
const {connectToDB} = require('./configs/dbConfig');
const {authRouter} = require('./routes/authRoutes');
const {postRouter} = require('./routes/postRoutes');
const {oAuthRouter} = require('./routes/oAuthRoutes');
const {historyRouter} = require('./routes/historyRoutes');
const {checkAuthorization} = require('./middlewares/checkAuth');
const {reportIssueViaMail} = require('./utils/helperFunctions');

require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, '../frontend/dist')));

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// connection with db
connectToDB();

// routes
app.use('/auth', authRouter);
app.use('/upload', postRouter);
app.use('/oauth', oAuthRouter);
app.use('/history', historyRouter);
app.post('/report-issue', checkAuthorization, reportIssueViaMail);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// run the server
app.listen(process.env.PORT, () =>{
    console.log('Server is running on PORT :', process.env.PORT);
})