const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../../app')

const { Author, Book, User, Code, Language, Genre } = require('../../models/index')

// Endpoint urls
const SIGNUP_USER_URL = '/api/v1/users/sign-up'
const BOOKS_URL = '/api/v1/books/'

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

const defaultQuery = {
  limit: 1,
  isbn: bookData.isbn,
  title: bookData.title,
  author: bookData.author.name,
  publisher: bookData.publisher,
  edition: bookData.edition,
  language: bookData.language,
  genre: bookData.genre
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
  await new Book({ ...bookData }).save()
}

const testRequired = async (attribute, errorCode) => {
  const invalidData = { ...bookData }
  delete invalidData[attribute]

  const response = await request
    .post(BOOKS_URL)
    .set('Authorization', `Bearer ${token}`)
    .send(invalidData)

  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('code', errorCode)
  expect(response.body).toHaveProperty('message')
  expect(response.body.message.toString())
    .toEqual(expect.stringContaining(`${Code[errorCode].value}: ${attribute}`))
}

const testInvalid = async (attribute, newValue, errorCode) => {
  const invalidData = { ...bookData }
  invalidData[attribute] = newValue

  const response = await request
    .post(BOOKS_URL)
    .set('Authorization', `Bearer ${token}`)
    .send(invalidData)

  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('code', errorCode)
  expect(response.body).toHaveProperty('message')
  expect(response.body.message.toString())
    .toEqual(expect.stringContaining(`${Code[errorCode].value}: ${attribute}`))
}

const testSearch = async (attribute, value) => {
  const newBookData = { ...bookData, author: { ...bookData.author } }
  newBookData[attribute] = value
  newBookData.isbn = '978-3-16-148410-1'

  await createBook(bookData)
  await createBook(newBookData)

  value = bookData[attribute]
  if (attribute === 'author') value = bookData[attribute].name

  const response = await request
    .get(BOOKS_URL)
    .set('Authorization', `Bearer ${token}`)
    .query({ [attribute]: value })

  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('success', true)
  expect(response.body).toHaveProperty('books')
  expect(response.body.books.length).toBe(1)
  expect(response.body.books[0]).toHaveProperty('id')
  expect(response.body.books[0]).toHaveProperty('isbn', bookData.isbn)
  expect(response.body.books[0]).toHaveProperty('title', bookData.title)
  expect(response.body.books[0]).toHaveProperty('author')
  expect(response.body.books[0].author.length).toBe(1)
  expect(response.body.books[0].author[0]).toBe(bookData.author.name)
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

describe('Unauthenticated Books Api Test', () => {
  it('Search for books', async () => {
    const response = await request
      .get(BOOKS_URL)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'A001')
    expect(response.body).toHaveProperty('message', Code.A001.value)
  })

  it('Create a new book', async () => {
    const response = await request
      .post(BOOKS_URL)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'A001')
    expect(response.body).toHaveProperty('message', Code.A001.value)
  })
})

describe('Authenticated Search Books Api Test', () => {
  beforeAll(async () => {
    await signUser()
  })

  it('Search for a book successfully', async () => {
    await createBook(bookData)

    const response = await request
      .get(BOOKS_URL)
      .set('Authorization', `Bearer ${token}`)
      .query(defaultQuery)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('books')
    expect(response.body.books.length).toBe(1)
    expect(response.body.books[0]).toHaveProperty('id')
    expect(response.body.books[0]).toHaveProperty('isbn', defaultQuery.isbn)
    expect(response.body.books[0]).toHaveProperty('title', defaultQuery.title)
    expect(response.body.books[0]).toHaveProperty('author')
    expect(response.body.books[0].author.length).toBe(1)
    expect(response.body.books[0].author[0]).toBe(defaultQuery.author)
    expect(response.body.books[0]).not.toHaveProperty('publisher')
    expect(response.body.books[0]).not.toHaveProperty('language')
    expect(response.body.books[0]).not.toHaveProperty('genre')
  })

  it('Search for a book by title', async () => {
    await testSearch('title', 'newtitle')
  })

  it('Search for a book by author', async () => {
    await testSearch('author', { name: 'newauthor', birth_date: Date.now() })
  })

  it('Search for a book by publisher', async () => {
    await testSearch('publisher', 'newpublisher')
  })

  it('Search for a book by langauge', async () => {
    await testSearch('language', Language.Hindi)
  })

  it('Search for a book by genre', async () => {
    await testSearch('genre', Genre.LGTBQ)
  })

  it('Find no book', async () => {
    const response = await request
      .get(BOOKS_URL)
      .set('Authorization', `Bearer ${token}`)
      .query(defaultQuery)

    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'B001')
    expect(response.body).toHaveProperty('message', Code.B001.value)
  })
})

describe('Authenticated Create Books Api Test', () => {
  beforeAll(async () => {
    await signUser()
  })

  it('Create a new book successfully', async () => {
    const response = await request
      .post(BOOKS_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...bookData })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body.book).toHaveProperty('id')
    expect(response.body.book).toHaveProperty('isbn', bookData.isbn)
    expect(response.body.book).toHaveProperty('title', bookData.title)
    expect(response.body.book).toHaveProperty('author')
    expect(response.body.book.author.length).toBe(1)
    expect(response.body.book.author[0]).toHaveProperty('name', bookData.author.name)
    expect(response.body.book).toHaveProperty('publisher', bookData.publisher)
    expect(response.body.book).toHaveProperty('language', bookData.language)
    expect(response.body.book).toHaveProperty('genre', bookData.genre)
  })

  it('Create a book without a request body', async () => {
    const response = await request
      .post(BOOKS_URL)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('code', 'B003')
    expect(response.body.message.toString())
      .toEqual(expect.stringContaining(`${Code.B003.value}: request body`))
  })

  it('Create a book without required isbn', async () => {
    await testRequired('isbn', 'B002')
  })

  it('Create a book without required title', async () => {
    await testRequired('title', 'B002')
  })

  it('Create a book without required author', async () => {
    await testRequired('author', 'B002')
  })

  it('Create a book without required author name', async () => {
    const invalidData = { ...bookData, author: { ...bookData.author } }
    delete invalidData.author.name

    const response = await request
      .post(BOOKS_URL)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('code', 'B002')
    expect(response.body).toHaveProperty('message')
    expect(response.body.message.toString())
      .toEqual(expect.stringContaining(`${Code.B002.value}: author.0.name`))
  })

  it('Create a book without required language', async () => {
    await testRequired('language', 'B002')
  })

  it('Create a book with invalid isbn', async () => {
    await testInvalid('isbn', '1', 'B003')
  })

  it('Create a book with invalid title', async () => {
    await testInvalid('isbn', '', 'B002')
  })

  it('Create a book with invalid year published (negative)', async () => {
    await testInvalid('year_published', -1, 'B003')
  })

  it('Create a book with invalid year published (future)', async () => {
    await testInvalid('year_published', new Date().getFullYear() + 1, 'B003')
  })

  it('Create a book with invalid langauge', async () => {
    await testInvalid('language', 'testlanguage', 'B003')
  })

  it('Create a book with invalid genre', async () => {
    await testInvalid('genre', 'testgenre', 'B003')
  })

  it('Create a book that already exists', async () => {
    await createBook(bookData)

    const response = await request
      .post(BOOKS_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...bookData })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('code', 'B004')
    expect(response.body).toHaveProperty('message', Code.B004.value)
  })
})
