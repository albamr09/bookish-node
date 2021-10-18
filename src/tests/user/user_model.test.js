const mongoose = require('mongoose')
const User = require('../../models/user')

const userData = { name: 'test', email: 'test@test.com', password: 'test1234', username: 'testname' }

describe('User Model Tests', () => {
  beforeAll(async () => {
    mongoose.connect(process.env.DB_URI)
    await User.deleteMany()
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    await User.deleteMany()
  })

  it('Create a new user', async () => {
    const user = new User(userData)
    const savedUser = await user.save()

    expect(savedUser._id).toBeDefined()
    expect(savedUser.name).toBe(userData.name)
    expect(savedUser.email).toBe(userData.email)
    expect(savedUser.password).toBe(userData.password)
  })

  it('Create a user with invalid fields', async () => {
    const invalidUserData = { ...userData }
    delete invalidUserData.email
    const user = new User(invalidUserData)

    let error

    try {
      const savedUser = await user.save()
      error = savedUser
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
    expect(error.errors.email).toBeDefined()
  })

  it('Create user that already exists', async () => {
    await new User(userData).save()

    let error

    try {
      await new User(userData).save()
    } catch (err) {
      error = err
    }

    expect(error).toBeDefined()
  })

  it('Create user with undefined fields', async () => {
    const newUserData = { ...userData }
    delete newUserData.name
    const user = new User(newUserData)
    await user.save()

    expect(user._id).toBeDefined()
    expect(user.name).toBeUndefined()
  })
})
