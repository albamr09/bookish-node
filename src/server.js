const mongoose = require('mongoose')
const app = require('./app')

// Initialize DB and start server
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    if (process.env.NODE_ENV === 'dev') {
      console.log(`Successfully connect to MongoDB: ${process.env.DB_URI}`)
    } else if (process.env.NODE_ENV === 'production') {
      console.log('Successfully connect to MongoDB')
    }
    app.listen(process.env.PORT,
      () => console.log(`Listening on ${process.env.PORT}`)
    )
  })
  .catch(err => console.log('Connection error', err))
