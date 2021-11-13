const express = require('express')
const router = express.Router()

const { signUp, login } = require('../controllers/user')

router.route('/sign-up').post(signUp)
router.route('/login').post(login)

module.exports = router
