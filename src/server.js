const mongoose = require('mongoose')
const app = require('./app')

console.log(process.env.DB_URI)

// Initialize DB and start server
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Successfully connect to MongoDB: ${process.env.DB_URI}`)
    app.listen(process.env.PORT,
      () => console.log(`Listening on ${process.env.PORT}`)
    )
  })
  .catch(err => console.log('Connection error', err))
