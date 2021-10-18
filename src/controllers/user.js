const User = require('../models/user')
const { Code, ApiError, ErrorMessage } = require('../models/error')

const createUser = async (req, res) => {
  const user = new User(req.body)
  await user.save()
    .then((result) => {
      return res.status(201).json({
        success: true,
        user: {
          id: result._id,
          name: result.name,
          email: result.email,
          username: result.username
        }
      })
    })
    .catch((error) => {
      let errorObject
      if (`${error}`.includes(ErrorMessage.M001.value)) {
        errorObject = new ApiError(Code.U001)
      } else if (`${error}`.includes(ErrorMessage.M002.value) ||
        `${error}`.includes(ErrorMessage.M003.value)) {
        errorObject = new ApiError(Code.U002)
      } else if (`${error}`.includes(ErrorMessage.M004.value)) {
        errorObject = new ApiError(Code.U003)
      }
      return res.status(400).json({ ...errorObject })
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
