const jwt = require('jsonwebtoken')

const { User, Code, ApiError, ErrorMessage } = require('../models/index')

const signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body
    const user = new User({ email, password, name })
    await user.save()
      .then((result) => {
        // Create a token
        const token = jwt.sign({ id: result._id }, process.env.TOKEN_SECRET, {
          expiresIn: '7200'
        })

        return res.status(201).json({
          success: true,
          user: {
            id: result._id,
            name: result.name,
            email: result.email,
            token
          }
        })
      })
      .catch((error) => {
        let errorObject
        if (`${error}`.includes(ErrorMessage.M001.value)) {
          errorObject = new ApiError(Code.U001)
        } else if (`${error}`.includes(ErrorMessage.M002.value) ||
          `${error}`.includes(ErrorMessage.M003.value)) {
          errorObject = new ApiError(Code.U002, Object.keys(error.errors))
        } else if (`${error}`.includes(ErrorMessage.M004.value)) {
          errorObject = new ApiError(Code.U003)
        }
        return res.status(400).json({ ...errorObject })
      })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ ...new ApiError(Code.S001, ` ${error}}`) })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !email.trim() || !password || !password.trim()) {
      return res.status(400).json({ ...new ApiError(Code.U002) })
    }

    const user = await User.findOne({ email }).exec()
    if (!user) {
      return res.status(400).json({ ...new ApiError(Code.U005) })
    }

    const match = await User.comparePassword(
      password,
      user.password
    )

    if (!match) {
      return res.status(400).json({ ...new ApiError(Code.U004) })
    }

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: '1800'
    })

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ ...new ApiError(Code.S001, ` ${error}}`) })
  }
}

module.exports = {
  signUp,
  login
}
