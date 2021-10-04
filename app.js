const express = require('express');

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT, process.env.HOST);
console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`);
