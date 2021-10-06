const express = require('express');
const mongoose = require("mongoose");

//Routes
const userRouter = require('./routes/user');

// App
const app = express();

// Middleware
app.use('/user/', userRouter);


// MongoDB
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
        console.log(`Successfully connect to MongoDB: ${process.env.DB_URI}`)
        app.listen(process.env.PORT)
    })
  .catch(err => console.error("Connection error", err));

app.get('/', (req, res) => {
  res.send('Hello World');
});

