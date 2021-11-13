const mongoose = require('mongoose')
const Model = mongoose.model

const Language = require('./language')
const Genre = require('./genre')
const { ErrorMessage } = require('./error')
const { AuthorSchema } = require('./author')

const BookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    unique: true,
    required: [true, ErrorMessage.M005.value],
    validate: {
      validator: function (v) {
        return /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(v)
      },
      message: props => `${ErrorMessage.M011.value} ${props.value}`
    }
  },
  title: {
    type: String,
    required: [true, ErrorMessage.M006.value]
  },
  year_published: {
    type: Number,
    min: [0, ErrorMessage.M008.value],
    max: [new Date().getFullYear(), ErrorMessage.M009.value]
  },
  publisher: String,
  edition: {
    type: Number,
    min: [0, ErrorMessage.M010.value]
  },
  language: {
    type: String,
    required: [true, ErrorMessage.M007.value],
    enum: {
      values: [...Object.values(Language)],
      message: ErrorMessage.M013.value
    }
  },
  genre: {
    type: String,
    enum: {
      values: [...Object.values(Genre)],
      message: ErrorMessage.M014.value
    }
  },
  author: {
    type: [AuthorSchema],
    default: undefined,
    required: [true, ErrorMessage.M015.value]
  }
})

const Book = new Model('Book', BookSchema)

module.exports = Book
