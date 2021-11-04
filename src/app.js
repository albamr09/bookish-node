const express = require('express')

const { userRouter, bookRouter, statusRouter } = require('./routes/index')

// App
const app = express()

// JSON middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routing Middleware
app.use('/api/v1/users/', userRouter)
app.use('/api/v1/books/', bookRouter)
app.use('/api/v1/status/', statusRouter)

module.exports = app
