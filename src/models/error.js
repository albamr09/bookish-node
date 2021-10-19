const Enum = require('enum')

const ErrorMessage = new Enum({
  M001: 'duplicate key error collection',
  M002: 'Email required',
  M003: 'Password required',
  M004: 'Email not valid: '
})

const Code = new Enum({
  U001: 'User already exists',
  U002: 'Missing required fields',
  U003: ErrorMessage.M004.value,
  U004: 'Wrong email of password',
  U005: 'This email does not exist'
})

class ApiError {
  constructor (errorCode) {
    this.success = false
    this.code = errorCode.key
    this.message = errorCode.value
  }
}

module.exports = { Code, ApiError, ErrorMessage }
