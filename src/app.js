const express = require('express')

const userRouter = require('./routes/user')

// App
const app = express()

// JSON middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routing Middleware
app.use('/api/v1/users/', userRouter)

module.exports = app
