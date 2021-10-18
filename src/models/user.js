const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model

const { ErrorMessage } = require('./error')

// Secure pass
// https://www.geeksforgeeks.org/nodejs-authentication-using-passportjs-and-passport-local-mongoose/

// Create a simple User's schema
const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: [true, ErrorMessage.M002.value],
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      },
      message: props => `${ErrorMessage.M004.value} ${props.value}`
    }
  },
  password: {
    type: String,
    required: [true, ErrorMessage.M003.value]
  }
})

const User = new Model('User', UserSchema)
module.exports = User
