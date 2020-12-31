const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors')

//configure environment variables
require('dotenv').config()

//import routes
const userRoutes = require('./router/userRoutes')
const todoRoutes = require('./router/todoRoutes')

//initialize app
const app = express()

//add middlewares
app.use(express.json())
app.use(cors({origin: '*'}))

// routes
app.use('/user', userRoutes)
app.use('/todo', todoRoutes)

exports.api = functions.https.onRequest(app);
