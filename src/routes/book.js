const express = require('express')
const router = express.Router()

const {
  getBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
  patchBook
} = require('../controllers/book')

const authenticateToken = require('../middleware/authJWT')

router.use('/', authenticateToken)
router.route('/').get(getBooks).post(createBook)
router.route('/:id').get(getBookById, updateBook, deleteBook, patchBook)

module.exports = router
