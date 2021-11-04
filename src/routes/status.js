const express = require('express')
const router = express.Router()

const { getStatus } = require('../controllers/status')

router.route('/').get(getStatus)

module.exports = router
