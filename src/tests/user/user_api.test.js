const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../../app')

const User = require('../../models/user')
const { Code } = require('../../models/error')

// Endpoint urls
const CREATE_USER_URL = '/api/v1/users/sign-up'
// const TOKEN_URL = '/api/v1/user/login'

// source: "https://www.rithmschool.com/courses/intermediate-node-express/api-tests-with-jest"

const createUser = async (payload) => {
  await User(payload).save()
}

describe('User Api Test', () => {
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

  it('Create new user sucess', async () => {
    const payload = {
      email: 'test@test.com',
      password: 'pass1234',
      name: 'test'
    }

    const response = await request
      .post(CREATE_USER_URL)
      .send(payload)

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('user')
    expect(response.body.user).toHaveProperty('id')
    expect(response.body.user).toHaveProperty('email')
    expect(response.body.user).toHaveProperty('name')
    expect(response.body.user).not.toHaveProperty('password')
    expect(response.body).toHaveProperty('success', true)
  })

  it('Create user exists', async () => {
    const payload = {
      email: 'test@test.com',
      password: 'pass1234',
      name: 'test'
    }

    createUser(payload)

    const response = await request
      .post(CREATE_USER_URL)
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
      .post(CREATE_USER_URL)
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
      .post(CREATE_USER_URL)
      .send(payload)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'U003')
    expect(response.body).toHaveProperty('message', Code.U003.value)
  })
})

//    it('Generate token success', ()=> {
//        const payload = {
//            'email': 'test@test.com',
//            'password': 'pass1234'
//        }
//
//        create_user(payload);
//
//        request
//            .post(CREATE_USER_URL)
//            .send(payload)
//            .expect(200)
//        done()
//    })

// describe('Authenticated User Api Test', () => {
// })
// https://tekloon.dev/how-I-setup-unit-test-for-mongodb-using-jest-mongoose
