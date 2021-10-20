const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../../app')

const { Author, Book, User, Code, Language, Genre } = require('../../models/index')

// Endpoint urls
const SIGNUP_USER_URL = '/api/v1/users/sign-up'
const BOOKS_URL = '/api/v1/books/'

let server = null
let request = null
let token = null

//test('It responds with JSON', () => {
//        return request(app)
//          .get('/')
//          .set('Authorization', `Bearer ${token}`)
//          .then((response) => {
//            expect(response.statusCode).toBe(200);
//            expect(response.type).toBe('application/json');
//          });
//      });

const signUser = async () => {
  const response = await request
    .post(SIGNUP_USER_URL)
    .send({
      email: 'test@test.com',
      password: 'pass1234',
      name: 'test'
    })
  token = response.body.token
}

const createBook = async (book, author) => {
  await Author.save(author)
  await Book.save({ ...book, author })
}

beforeAll(async () => {
  mongoose.connect(process.env.DB_URI)
  await Book.deleteMany()
  await User.deleteMany()

  server = app.listen()
  request = supertest.agent(server)

  signUser()
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})

beforeEach(async () => {
  await Book.deleteMany()
  await User.deleteMany()
})

describe('Unauthenticated Book Api Test', () => {
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

describe('Authenticated Book Api Test', () => {
  it('Search for a book successfully', async () => {
    const author = {
      name: 'testauthor',
      birth_date: Date.now()
    }

    const book = {
      isbn: '978-3-16-148410-0',
      title: 'test',
      year_published: 1900,
      publisher: 'testpublisher',
      edition: 1,
      language: Language.English,
      genre: Genre.Horror
    }

    const query = {
      limit: 1,
      isbn: book.isbn,
      title: book.title,
      author: author.name,
      publisher: book.publisher,
      edition: book.edition,
      language: book.language,
      genre: book.genre
    }

    createBook(book, author)

    const response = await request
      .get(BOOKS_URL)
      .query(query)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body.book).toHaveProperty('_id')
    expect(response.body.book).toHaveProperty('isbn', query.isbn)
    expect(response.body.book).toHaveProperty('title', query.title)
    expect(response.body.book).toHaveProperty('author', query.author)
    expect(response.body.book).toHaveProperty('publisher', query.publisher)
    expect(response.body.book).toHaveProperty('language', query.language)
    expect(response.body.book).toHaveProperty('genre', query.genre)
  })

  it('Find no book', async () => {
    const query = {
      limit: 1,
      isbn: '978-3-16-148410-0',
      title: 'test',
      author: 'testauthor',
      year_published: 1900,
      publisher: 'testpublisher',
      edition: 1,
      language: Language.English,
      genre: Genre.Horror
    }

    const response = await request
      .get(BOOKS_URL)
      .query(query)

    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('code', 'B001')
    expect(response.body).toHaveProperty('message', Code.B001.value)
  })

  it('Create a new book successfully', async () => {
  })

  it('Create a book without a request body', async () => {
  })

  it('Create a book without required isbn', async () => {
  })

  it('Create a book without required title', async () => {
  })

  it('Create a book without required author', async () => {
  })

  it('Create a book with invalid isbn', async () => {
  })
  it('Create a book with invalid year published', async () => {
  })
  it('Create a book with invalid language', async () => {
  })
  it('Create a book with invalid genre', async () => {
  })
})
