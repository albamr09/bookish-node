const Enum = require('enum')

const ErrorMessage = new Enum({
  M001: 'duplicate key error collection',
  M002: 'Email required',
  M003: 'Password required',
  M004: 'Email not valid: ',
  M005: 'ISBN required',
  M006: 'Title required',
  M007: 'Language required',
  M008: 'Year cannot be negative',
  M009: 'Year cannot be greater than current year',
  M010: 'Edition cannot be negative',
  M011: 'ISBN not valid: ',
  M012: 'Author name required',
  M013: 'This language is not supported',
  M014: 'This genre is not supported',
  M015: 'Author required'
})

const Code = new Enum({
  U001: 'User already exists',
  U002: 'Missing required fields',
  U003: ErrorMessage.M004.value,
  U004: 'Wrong email of password',
  U005: 'This email does not exist',
  A001: 'User not authenticated',
  B001: 'No book was found',
  B002: 'Missing required fields',
  B003: 'Data is not valid',
  B004: 'This ISBN is already registered'
})

class ApiError {
  constructor (errorCode, value) {
    this.success = false
    this.code = errorCode.key
    this.message = errorCode.value
    if (value) this.message = `${this.message}: ${value}`
  }
}

module.exports = { Code, ApiError, ErrorMessage }
