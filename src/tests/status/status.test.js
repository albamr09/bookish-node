const supertest = require('supertest')

const app = require('../../app')
const { Message } = require('../../models/index')

// Endpoint urls
const STATUS_URL = '/api/v1/status'

let server = null
let request = null

beforeAll(async () => {
  server = app.listen()
  request = supertest.agent(server)
})

afterAll(() => {
  server.close()
})

describe('Status', () => {
  it('Get API\'s status', async () => {
    const response = await request
      .get(`${STATUS_URL}`)

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe(Message.M001.value)
  })
})
