const express = require('express');
const cors = require('cors');
const {connectToDB} = require('./configs/dbConfig');
const {authRouter} = require('./routes/authRoutes');
const {postRouter} = require('./routes/postRoutes');
const {oAuthRouter} = require('./routes/oAuthRoutes');
const {historyRouter} = require('./routes/historyRoutes');

require('dotenv').config();

const app = express();

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

// run the server
app.listen(process.env.PORT, () =>{
    console.log('Server is running on PORT :', process.env.PORT);
})