const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model

// Secure pass
// https://www.geeksforgeeks.org/nodejs-authentication-using-passportjs-and-passport-local-mongoose/

// Create a simple User's schema
const UserSchema = new Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

const User = new Model('User', UserSchema)
module.exports = User
