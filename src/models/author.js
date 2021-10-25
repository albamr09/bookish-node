const mongoose = require('mongoose')
const Model = mongoose.model

const { ErrorMessage } = require('./error')

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, ErrorMessage.M012.value]
  },
  birth_date: Date
})

const Author = new Model('Author', AuthorSchema)

module.exports = { Author, AuthorSchema }
