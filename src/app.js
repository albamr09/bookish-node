const express = require('express')

const { userRouter, bookRouter } = require('./routes/index')

// App
const app = express()

// JSON middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routing Middleware
app.use('/api/v1/users/', userRouter)
app.use('/api/v1/books/', bookRouter)

module.exports = app
