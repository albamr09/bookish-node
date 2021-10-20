const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../../app')

const { User, Code } = require('../../models/index')

// Endpoint urls
const SIGNUP_USER_URL = '/api/v1/users/sign-up'
const LOGIN_USER_URL = '/api/v1/users/login'

const createUser = async (payload) => {
  await User(payload).save()
}

let server = null
let request = null

beforeAll(async () => {
  mongoose.connect(process.env.DB_URI)
  await User.deleteMany()

  server = app.listen()
  request = supertest.agent(server)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})

beforeEach(async () => {
  await User.deleteMany()
})

describe('Sign Up User', () => {
  it('Create new user sucess', async () => {
    const payload = {
      email: 'test@test.com',
      password: 'pass1234',
      name: 'test'
    }

    const response = await request
      .post(SIGNUP_USER_URL)
      .send(payload)

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('user')
    expect(response.body.user).toHaveProperty('id')
    expect(response.body.user).toHaveProperty('email')
    expect(response.body.user).toHaveProperty('name')
    expect(response.body.user).not.toHaveProperty('password')
    expect(response.body.user).toHaveProperty('token')
    expect(response.body).toHaveProperty('success', true)
  })

  it('Create user exists', async () => {
    const payload = {
      email: 'test@test.com',
      password: 'pass1234',
      name: 'test'
    }

    await createUser(payload)

    const response = await request
      .post(SIGNUP_USER_URL)
      .send(payload)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'U001')
    expect(response.body).toHaveProperty('message', Code.U001.value)
  })

  it('Create new user invalid data', async () => {
    const payload = {
      password: 'pass1234',
      name: 'test'
    }

    const response = await request
      .post(SIGNUP_USER_URL)
      .send(payload)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'U002')
    expect(response.body).toHaveProperty('message', Code.U002.value)
  })

  it('Create new user with invalid email', async () => {
    const payload = {
      email: 'test',
      password: 'pass123',
      name: 'test'
    }

    const response = await request
      .post(SIGNUP_USER_URL)
      .send(payload)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'U003')
    expect(response.body).toHaveProperty('message', Code.U003.value)
  })
})

describe('Login User', () => {
  it('Login user success', async () => {
    const payload = {
      email: 'test@test.com',
      password: '1234pass'
    }

    await createUser({ ...payload, name: 'test' })

    const response = await request
      .post(LOGIN_USER_URL)
      .send(payload)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('user')
    expect(response.body.user).toHaveProperty('id')
    expect(response.body.user).toHaveProperty('email')
    expect(response.body.user).toHaveProperty('name')
    expect(response.body.user).not.toHaveProperty('password')
    expect(response.body.user).toHaveProperty('token')
    expect(response.body).toHaveProperty('success', true)
  })

  it('Login user with erroneous data', async () => {
    const payload = {
      email: 'test@test.com',
      password: 'pass1234'
    }

    await createUser(payload)

    const response = await request
      .post(LOGIN_USER_URL)
      .send({ email: 'test@test.com', password: 'wrongpass' })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'U004')
    expect(response.body).toHaveProperty('message', Code.U004.value)
  })

  it('Login user without required fields', async () => {
    const payload = {
      email: 'test@test.com',
      password: 'pass1234'
    }

    await createUser(payload)

    const response = await request
      .post(LOGIN_USER_URL)
      .send({ password: payload.password })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'U002')
    expect(response.body).toHaveProperty('message', Code.U002.value)
  })

  it('Login user does not exist', async () => {
    const payload = {
      email: 'test@test.com',
      password: 'pass1234'
    }

    const response = await request
      .post(LOGIN_USER_URL)
      .send(payload)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'U005')
    expect(response.body).toHaveProperty('message', Code.U005.value)
  })
})
