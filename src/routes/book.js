const express = require('express')
const router = express.Router()

const { getBooks, createBook } = require('../controllers/book')
const authenticateToken = require('../middleware/authJWT')

router.use('/', authenticateToken)
router.route('/').get(getBooks).post(createBook)

module.exports = router
