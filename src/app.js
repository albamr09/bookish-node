const express = require('express');
const mongoose = require("mongoose");

// App
const app = express();
console.log(process.env.DB_URI)

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
        console.log("Successfully connect to MongoDB.")
        app.listen(process.env.PORT)
    })
  .catch(err => console.error("Connection error", err));

app.get('/', (req, res) => {
  res.send('Hello World');
});

