const User = require('../models/user')

const createUser = async (req, res) => {
  const user = new User(req.body)
  await user.save()
    .then((result) => {
      return res.status(201).json({ success: true, name: result.name, email: result.email, username: result.username })
    })
    .catch((error) => {
      const errors = []
      if (error.errors) {
        Object.keys(error.errors).map((key, _) => errors.push({ [key]: error.errors[key].kind }))
      } else {
        errors.push(error.keyPattern)
      }
      return res.status(400).json({ success: false, message: errors })
    })
}

const updateUser = async (req, res) => {

}

const findByIdUser = async (req, res) => {

}

const deleteUser = async (req, res) => {
}

module.exports = {
  createUser,
  updateUser,
  findByIdUser,
  deleteUser
}
