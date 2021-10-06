const express = require('express');
const router = express.Router();

const { createUser } = require('../controllers/user');

router.route('/sign-up').post(createUser);

module.exports = router;
