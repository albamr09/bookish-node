const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const Model = mongoose.model

const { ErrorMessage } = require('./error')

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

// Hash password
UserSchema.pre('save', function (next) {
  // If the user is not being changed/created do nothing
  if (!this.isModified('password')) {
    return next()
  }
  // Hash password
  this.password = bcrypt.hashSync(this.password, 10)
  next()
})

// Compare hashed password to user password
UserSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword)
}

const User = new Model('User', UserSchema)
module.exports = User
