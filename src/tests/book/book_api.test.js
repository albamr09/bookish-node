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

describe('Unathenticated Book Api Test', () => {
  it('GET Book', async () => {
    const response = await request
      .get(`${BOOKS_URL}/1`)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'A001')
    expect(response.body).toHaveProperty('message', Code.A001.value)
  })

  it('PUT Book', async () => {
    const response = await request
      .put(`${BOOKS_URL}/1`)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'A001')
    expect(response.body).toHaveProperty('message', Code.A001.value)
  })

  it('DELETE Book', async () => {
    const response = await request
      .delete(`${BOOKS_URL}/1`)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'A001')
    expect(response.body).toHaveProperty('message', Code.A001.value)
  })

  it('PATCH Book', async () => {
    const response = await request
      .patch(`${BOOKS_URL}/1`)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'A001')
    expect(response.body).toHaveProperty('message', Code.A001.value)
  })
})

describe('Authenticated GET Book Api Test', () => {
  beforeAll(async () => {
    await signUser()
  })

  it('GET Book by id successfully', async () => {
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

  it('GET Book by with non existing id', async () => {
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

const testRequired = async (attribute) => {
  const newBookData = { ...bookData, author: { ...bookData.author } }
  delete newBookData[attribute]

  const book = await createBook(bookData)

  const response = await request
    .set('Authorization', `Bearer ${token}`)
    .put(`${BOOKS_URL}/${book._id}`)
    .send(newBookData)

  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('success', false)
  expect(response.body).toHaveProperty('code', 'B002')
  expect(response.body).toHaveProperty('message')
  expect(response.body.message.toString())
    .toEqual(expect.stringContaining(`${Code.B002.value}: ${attribute}`))
}

const testInvalid = async (attribute, value, code) => {
  const newBookData = { ...bookData, author: { ...bookData.author } }
  newBookData[attribute] = value

  const book = await createBook(bookData)

  const response = await request
    .set('Authorization', `Bearer ${token}`)
    .put(`${BOOKS_URL}/${book._id}`)
    .send(newBookData)

  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('success', false)
  expect(response.body).toHaveProperty('code', code)
  expect(response.body).toHaveProperty('message')
  expect(response.body.message.toString())
    .toEqual(expect.stringContaining(`${Code[code].value}: ${attribute}`))
}

describe('Authenticated PUT Book Api Test', () => {
  beforeAll(async () => {
    await signUser()
  })

  it('PUT Book successfull', async () => {
    const newBookData = { ...bookData, author: { ...bookData.author } }
    newBookData.isbn = '978-3-16-148410-1'
    newBookData.title = 'newtitle'

    const book = await createBook(bookData)

    const response = await request
      .set('Authorization', `Bearer ${token}`)
      .put(`${BOOKS_URL}/${book._id}`)
      .send(newBookData)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('book')
    expect(response.body.book).toHaveProperty('isbn', newBookData.isbn)
    expect(response.body.book).toHaveProperty('title', newBookData.title)
    expect(response.body.book).toHaveProperty('edition', newBookData.edition)
    expect(response.body.book).toHaveProperty('year_published', newBookData.year_published)
    expect(response.body.book).toHaveProperty('publisher', newBookData.publisher)
    expect(response.body.book).toHaveProperty('language', newBookData.language)
    expect(response.body.book).toHaveProperty('genre', newBookData.genre)
    expect(response.body.book).toHaveProperty('author')
    expect(response.body.book.author.length).toBe(1)
    expect(response.body.book.author[0]).toHaveProperty('name', newBookData.author.name)
  })

  it('PUT Book without required isbn', async () => {
    await testRequired('isbn')
  })

  it('PUT Book without required title', async () => {
    await testRequired('title')
  })

  it('PUT Book without required language', async () => {
    await testRequired('language')
  })

  it('PUT Book without required author', async () => {
    await testRequired('author')
  })

  it('PUT Book with invalid isbn', async () => {
    await testInvalid('isbn', '1', 'B003')
  })

  it('PUT Book with invalid title', async () => {
    await testInvalid('title', '', 'B002')
  })

  it('PUT Book with invalid year_published (negative)', async () => {
    await testInvalid('year_published', -1, 'B003')
  })

  it('PUT Book with invalid year_published (future)', async () => {
    await testInvalid('year_published', new Date().getFullYear() + 1, 'B003')
  })

  it('PUT Book with invalid edition', async () => {
    await testInvalid('edition', -1, 'B003')
  })

  it('PUT Book with invalid language', async () => {
    await testInvalid('language', 'whatever', 'B003')
  })

  it('PUT Book with invalid genre', async () => {
    await testInvalid('genre', 'whatevergenre', 'B003')
  })

  it('PUT Book with non existing id', async () => {
    const newBookData = { ...bookData, author: { ...bookData.author } }
    newBookData.isbn = '978-3-16-148410-1'

    await createBook(bookData)
    await createBook(newBookData)

    const response = await request
      .set('Authorization', `Bearer ${token}`)
      .put(`${BOOKS_URL}/111111111111111111111111`)
      .send(newBookData)

    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'B001')
    expect(response.body).toHaveProperty('message', Code.B001.value)
  })
})

describe('Authenticated DELETE Api Test', () => {
  beforeAll(async () => {
    await signUser()
  })

  it('DELETE Book successfully', async () => {
    const book = await createBook(bookData)

    const response = await request
      .set('Authorization', `Bearer ${token}`)
      .delete(`${BOOKS_URL}/${book._id}`)

    expect(response.statusCode).toBe(204)
  })

  it('DELETE Book with non existing id', async () => {
    const newBookData = { ...bookData, author: { ...bookData.author } }
    newBookData.isbn = '978-3-16-148410-1'

    await createBook(bookData)
    await createBook(newBookData)

    const response = await request
      .set('Authorization', `Bearer ${token}`)
      .delete(`${BOOKS_URL}/111111111111111111111111`)

    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'B001')
    expect(response.body).toHaveProperty('message', Code.B001.value)
  })
})

const testRequiredPatch = async (attribute) => {
  const newBookData = {
    [attribute]: null
  }

  const book = await createBook(bookData)

  const response = await request
    .set('Authorization', `Bearer ${token}`)
    .patch(`${BOOKS_URL}/${book._id}`)
    .send(newBookData)

  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('success', false)
  expect(response.body).toHaveProperty('code', 'B002')
  expect(response.body).toHaveProperty('message')
  expect(response.body.message.toString())
    .toEqual(expect.stringContaining(`${Code.B002.value}: ${attribute}`))
}

const testInvalidPatch = async (attribute, value, code) => {
  const newBookData = {
    [attribute]: value
  }

  const book = await createBook(bookData)

  const response = await request
    .set('Authorization', `Bearer ${token}`)
    .patch(`${BOOKS_URL}/${book._id}`)
    .send(newBookData)

  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('success', false)
  expect(response.body).toHaveProperty('code', code)
  expect(response.body).toHaveProperty('message')
  expect(response.body.message.toString())
    .toEqual(expect.stringContaining(`${Code[code].value}: ${attribute}`))
}

describe('Authenticated PATCH Book Api Test', () => {
  beforeAll(async () => {
    await signUser()
  })

  it('PATCH Book successfull', async () => {
    const newBookData = {
      isbn: '978-3-16-148410-1',
      title: 'newtitle',
      author: {
        name: 'newauthor',
        birth_date: Date.now()
      }
    }

    const book = await createBook(bookData)

    const response = await request
      .set('Authorization', `Bearer ${token}`)
      .patch(`${BOOKS_URL}/${book._id}`)
      .send(newBookData)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('book')
    expect(response.body.book).toHaveProperty('isbn', newBookData.isbn)
    expect(response.body.book).toHaveProperty('title', newBookData.title)
    expect(response.body.book).toHaveProperty('edition', bookData.edition)
    expect(response.body.book).toHaveProperty('year_published', bookData.year_published)
    expect(response.body.book).toHaveProperty('publisher', bookData.publisher)
    expect(response.body.book).toHaveProperty('language', bookData.language)
    expect(response.body.book).toHaveProperty('genre', bookData.genre)
    expect(response.body.book).toHaveProperty('author')
    expect(response.body.book.author.length).toBe(1)
    expect(response.body.book.author[0]).toHaveProperty('name', newBookData.author.name)
  })

  it('PATCH Book without required isbn', async () => {
    await testRequiredPatch('isbn')
  })

  it('PATCH Book without required title', async () => {
    await testRequiredPatch('title')
  })

  it('PATCH Book without required language', async () => {
    await testRequiredPatch('language')
  })

  it('PATCH Book without required author', async () => {
    await testRequiredPatch('author')
  })

  it('PATCH Book with invalid isbn', async () => {
    await testInvalidPatch('isbn', '1', 'B003')
  })

  it('PATCH Book with invalid title', async () => {
    await testInvalidPatch('title', '', 'B002')
  })

  it('PATCH Book with invalid year_published (negative)', async () => {
    await testInvalidPatch('year_published', -1, 'B003')
  })

  it('PATCH Book with invalid year_published (future)', async () => {
    await testInvalidPatch('year_published', new Date().getFullYear() + 1, 'B003')
  })

  it('PATCH Book with invalid edition', async () => {
    await testInvalidPatch('edition', -1, 'B003')
  })

  it('PATCH Book with invalid language', async () => {
    await testInvalidPatch('language', 'whatever', 'B003')
  })

  it('PATCH Book with invalid genre', async () => {
    await testInvalidPatch('genre', 'whatevergenre', 'B003')
  })

  it('PATCH Book with non existing id', async () => {
    const newBookData = {
      isbn: '978-3-16-148410-1'
    }

    await createBook(bookData)

    const response = await request
      .set('Authorization', `Bearer ${token}`)
      .patch(`${BOOKS_URL}/111111111111111111111111`)
      .send(newBookData)

    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'B001')
    expect(response.body).toHaveProperty('message', Code.B001.value)
  })
})
