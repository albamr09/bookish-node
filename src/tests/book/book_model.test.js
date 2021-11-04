const mongoose = require('mongoose')

const { Author, Book, ErrorMessage, Language, Genre } = require('../../models/index')

const authorData = { name: 'test', birth_date: new Date() }

const bookData = {
  isbn: '978-3-16-148410-0',
  title: 'City of Nebula',
  edition: 1,
  year_published: 1984,
  publisher: 'Penguin Random House',
  language: Language.Chinese,
  genre: Genre.Fantasy
}

beforeAll(async () => {
  mongoose.connect(process.env.DB_URI)
  await Author.deleteMany()
  await Book.deleteMany()
})

afterAll(async () => {
  await mongoose.connection.close()
})

beforeEach(async () => {
  await Author.deleteMany()
  await Book.deleteMany()
})

const testRequired = async (attribute, errorMessage) => {
  const invalidBookData = { ...bookData, author: { ...authorData } }
  delete invalidBookData[attribute]

  let error
  try {
    error = await new Book({ ...invalidBookData }).save()
  } catch (err) {
    error = err
  }

  expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
  expect(error.toString()).toEqual(
    expect.stringContaining(errorMessage))
  expect(error.errors[attribute]).toBeDefined()
}

const testInvalid = async (attribute, newValue, errorMessage) => {
  const invalidBookData = { ...bookData, author: { ...authorData } }
  invalidBookData[attribute] = newValue

  let error

  try {
    error = await new Book({ ...invalidBookData }).save()
  } catch (err) {
    error = err
  }

  expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
  expect(error.toString()).toEqual(
    expect.stringContaining(errorMessage))
  expect(error.errors[attribute]).toBeDefined()
}

const createBook = async (data) => {
  return await new Book({ ...data }).save()
}

describe('Book model tests', () => {
  it('Create book successfully', async () => {
    const author = await new Author(authorData).save()
    const book = await createBook({ ...bookData, author: author })

    expect(book._id).toBeDefined()
    expect(book).toHaveProperty('isbn', bookData.isbn)
    expect(book).toHaveProperty('title', bookData.title)
    expect(book).toHaveProperty('year_published', bookData.year_published)
    expect(book).toHaveProperty('publisher', bookData.publisher)
    expect(book).toHaveProperty('language', bookData.language)
    expect(book).toHaveProperty('genre', bookData.genre)
    expect(book).toHaveProperty('author')
    expect(book.author.length).toBe(1)
  })

  it('Create book without required isbn', async () => {
    await testRequired('isbn', ErrorMessage.M005.value)
  })

  it('Create book without required title', async () => {
    await testRequired('title', ErrorMessage.M006.value)
  })

  it('Create book without required language', async () => {
    await testRequired('language', ErrorMessage.M007.value)
  })

  it('Create book without required author', async () => {
    await testRequired('author', ErrorMessage.M015.value)
  })

  it('Create book with invalid isbn', async () => {
    await testInvalid('isbn', '1', ErrorMessage.M011.value)
  })

  it('Create book with invalid title', async () => {
    await testInvalid('title', '', ErrorMessage.M006.value)
  })

  it('Create book with invalid (negative) year', async () => {
    await testInvalid('year_published', -1, ErrorMessage.M008.value)
  })

  it('Create book with invalid (future) year', async () => {
    await testInvalid('year_published', new Date().getFullYear() + 1,
      ErrorMessage.M009.value)
  })

  it('Create book with invalid (negative) edition number', async () => {
    await testInvalid('edition', -1, ErrorMessage.M010.value)
  })

  it('Create book with invalid language', async () => {
    await testInvalid('language', 'testlanguage', ErrorMessage.M013.value)
  })

  it('Create book with invalid genre', async () => {
    await testInvalid('genre', 'testgenre', ErrorMessage.M014.value)
  })

  it('Create book that already exists', async () => {
    await createBook({ ...bookData, author: { ...authorData } })

    let error
    try {
      await createBook({ ...bookData })
    } catch (err) {
      error = err
    }

    expect(error).toBeDefined()
  })
})
