const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const connectDb = require('./database/dbconfig')
const userRoutes = require('./Routers/userRoute')
const insertData = require('./Routers/addData')
const quizApis = require('./Routers/quizApi')

const app = express()
app.use(express.json())
app.use(cors())

connectDb()

const port = process.env.PORT || 3001

app.use('/api/user/',userRoutes);
app.use('/api/insert/',insertData);
app.use('/api/quiz/',quizApis);

app.listen(port,()=>console.log(`Application is running at http://localhost:${port}`));