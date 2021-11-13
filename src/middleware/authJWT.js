const jwt = require('jsonwebtoken')

const { Code, ApiError } = require('../models/index')

function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.status(401).json({ ...new ApiError(Code.A001) })

  jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
    if (error) {
      console.error(error)
      return res.sendStatus(500)
    }

    req.user = user
    next()
  })
}

module.exports = authenticateToken
