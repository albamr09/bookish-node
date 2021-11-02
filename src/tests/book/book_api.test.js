const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../../app')

const { Author, Book, User, Language, Genre, Code } = require('../../models/index')

const BOOKS_URL = '/api/v1/books'
const SIGNUP_USER_URL = '/api/v1/users/sign-up'

const bookData = {
  isbn: '978-3-16-148410-0',
  title: 'test',
  year_published: 1900,
  publisher: 'testpublisher',
  edition: 1,
  language: Language.Chinese,
  genre: Genre.Horror,
  author: {
    name: 'testauthor',
    birth_date: Date.now()
  }
}

let server = null
let request = null
let token = null

const signUser = async () => {
  const response = await request
    .post(SIGNUP_USER_URL)
    .send({
      email: 'test@test.com',
      password: 'pass1234',
      name: 'test'
    })
  token = response.body.user.token
}

const createBook = async (bookData) => {
  return await new Book({ ...bookData }).save()
}

beforeAll(async () => {
  mongoose.connect(process.env.DB_URI)
  await Author.deleteMany()
  await Book.deleteMany()
  await User.deleteMany()

  server = app.listen()
  request = supertest.agent(server)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})

beforeEach(async () => {
  await Author.deleteMany()
  await Book.deleteMany()
  await User.deleteMany()
})

describe('Unathenticated Get Book Api Test', () => {
  it('Get Book', async () => {
    const response = await request
      .get(`${BOOKS_URL}/1`)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'A001')
    expect(response.body).toHaveProperty('message', Code.A001.value)
  })
})

describe('Authenticated Get Book Api Test', () => {
  beforeAll(async () => {
    await signUser()
  })

  it('Get Book by id successfully', async () => {
    const newBookData = { ...bookData, author: { ...bookData.author } }
    newBookData.isbn = '978-3-16-148410-1'

    const book = await createBook(bookData)
    await createBook(newBookData)

    const response = await request
      .get(`${BOOKS_URL}/${book._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('book')
    expect(response.body.book).toHaveProperty('isbn', book.isbn)
    expect(response.body.book).toHaveProperty('title', book.title)
    expect(response.body.book).toHaveProperty('edition', book.edition)
    expect(response.body.book).toHaveProperty('year_published', book.year_published)
    expect(response.body.book).toHaveProperty('publisher', book.publisher)
    expect(response.body.book).toHaveProperty('language', book.language)
    expect(response.body.book).toHaveProperty('genre', book.genre)
    expect(response.body.book).toHaveProperty('author')
    expect(response.body.book.author.length).toBe(1)
    expect(response.body.book.author[0]).toHaveProperty('name', book.author[0].name)
  })

  it('Get Book by with non existing id', async () => {
    const newBookData = { ...bookData, author: { ...bookData.author } }
    newBookData.isbn = '978-3-16-148410-1'

    await createBook(bookData)
    await createBook(newBookData)

    const response = await request
      .get(`${BOOKS_URL}/111111111111111111111111`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'B001')
    expect(response.body).toHaveProperty('message', Code.B001.value)
  })
})
