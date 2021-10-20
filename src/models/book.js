const mongoose = require('mongoose')
const Model = mongoose.model

const { AuthorSchema } = require('./author')
const Language = require('./language')
const Genre = require('./genre')

const BookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    unique: true,
    required: [true, 'message'],
    validate: {
      validator: function (v) {
        return /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(v)
      },
      message: props => `message ${props.value}`
    }
  },
  title: {
    type: String,
    required: [true, 'message']
  },
  year_published: {
    type: Number,
    min: [0, 'message'],
    max: [new Date().getFullYear(), 'message']
  },
  publisher: String,
  edition: {
    type: Number,
    min: [0, 'message']
  },
  language: {
    type: String,
    required: [true, 'message'],
    enum: [...Language]
  },
  genre: {
    type: String,
    enum: [...Genre]
  },
  author: {
    type: AuthorSchema,
    required: [true, 'message']
  }
})

const Book = new Model('Book', BookSchema)

module.exports = Book
