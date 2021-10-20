const { Book, Code, ApiError, ErrorMessage } = require('../models/index')

const getBooks = async (req, res) => {
  return res.status(200).send('hello')
}

const createBook = async (req, res) => {
  return res.status(200).send('hello')
}

module.exports = { getBooks, createBook }
