const mongoose = require('mongoose')
const Model = mongoose.model

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'message']
  },
  birth_date: Date
})

const Author = new Model('Author', AuthorSchema)

module.exports = { Author, AuthorSchema }
