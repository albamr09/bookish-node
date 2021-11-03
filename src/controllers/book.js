const { Book, Code, ApiError, ErrorMessage } = require('../models/index')

const getBooks = async (req, res) => {
  try {
    const {
      limit,
      isbn,
      title,
      publisher,
      edition,
      language,
      genre,
      author
    } = req.query

    const books = await Book.find({ $or: [{ 'author.name': author }, { isbn }, { title }, { publisher }, { edition }, { language }, { genre }] })
    const basicBooks = books.map(book => ({ id: book._id, isbn: book.isbn, title: book.title, author: book.author.map(author => author.name) }))
    if (basicBooks.length >= 1) {
      return res.status(200).json({ success: true, books: [...basicBooks.slice(0, limit)] })
    } else {
      return res.status(404).json({ ...new ApiError(Code.B001) })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

const createBook = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ ...new ApiError(Code.B003, 'request body') })
  }
  try {
    const {
      isbn,
      title,
      year_published,
      publisher,
      edition,
      language,
      genre,
      author
    } = req.body

    const book = new Book({
      isbn,
      title,
      year_published,
      publisher,
      edition,
      language,
      genre,
      author
    })

    await book.save()
      .then((result) => {
        return res.status(201).json({
          success: true,
          book: {
            id: result._id,
            isbn: result.isbn,
            title: result.title,
            year_published: result.year_published,
            publisher: result.publisher,
            edition: result.edition,
            language: result.language,
            genre: result.genre,
            author: result.author
          }
        })
      })
      .catch((error) => {
        let errorObject
        if (`${error}`.includes(ErrorMessage.M005.value) ||
        `${error}`.includes(ErrorMessage.M006.value) ||
        `${error}`.includes(ErrorMessage.M007.value) ||
        `${error}`.includes(ErrorMessage.M015.value) ||
        `${error}`.includes(ErrorMessage.M012.value)) {
          errorObject = new ApiError(Code.B002, Object.keys(error.errors))
        } else if (`${error}`.includes(ErrorMessage.M008.value) ||
          `${error}`.includes(ErrorMessage.M009.value) ||
          `${error}`.includes(ErrorMessage.M010.value) ||
          `${error}`.includes(ErrorMessage.M011.value) ||
          `${error}`.includes(ErrorMessage.M013.value) ||
          `${error}`.includes(ErrorMessage.M014.value)) {
          errorObject = new ApiError(Code.B003, Object.keys(error.errors))
        } else if (`${error}`.includes(ErrorMessage.M001.value)) {
          errorObject = new ApiError(Code.B004)
        }
        return res.status(400).json({ ...errorObject })
      })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

const getBookById = async (req, res) => {
  try {
    const { id } = req.params
    const book = await Book.findById(id).exec()

    if (!book) {
      return res.status(404).json({ ...new ApiError(Code.B001) })
    }

    return res.status(200).json({
      book: {
        id: book._id,
        isbn: book.isbn,
        title: book.title,
        year_published: book.year_published,
        publisher: book.publisher,
        edition: book.edition,
        language: book.language,
        genre: book.genre,
        author: book.author.map(author => { return { name: author.name, birth_date: author.birth_date } })
      },
      success: true
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

const updateBook = async (req, res) => {
  try {
    const { id } = req.params

    const {
      isbn,
      title,
      year_published,
      publisher,
      edition,
      language,
      genre,
      author
    } = req.body

    await Book.findOneAndReplace({ _id: id },
      {
        isbn,
        title,
        year_published,
        publisher,
        edition,
        language,
        genre,
        author
      },
      { returnDocument: 'after' }
    ).then((result) => {
      if (!result) return res.status(404).json({ ...new ApiError(Code.B001) })

      return res.status(200).json({
        book: {
          id: result.id,
          isbn: result.isbn,
          title: result.title,
          edition: result.edition,
          year_published: result.year_published,
          author: result.author,
          publisher: result.publisher,
          language: result.language,
          genre: result.genre
        },
        success: true
      })
    }).catch((error) => {
      let errorObject
      if (`${error}`.includes(ErrorMessage.M005.value) ||
        `${error}`.includes(ErrorMessage.M006.value) ||
        `${error}`.includes(ErrorMessage.M007.value) ||
        `${error}`.includes(ErrorMessage.M015.value)
      ) {
        errorObject = new ApiError(Code.B002, Object.keys(error.errors))
      } else if (`${error}`.includes(ErrorMessage.M008.value) ||
           `${error}`.includes(ErrorMessage.M009.value) ||
           `${error}`.includes(ErrorMessage.M010.value) ||
           `${error}`.includes(ErrorMessage.M011.value) ||
           `${error}`.includes(ErrorMessage.M013.value) ||
           `${error}`.includes(ErrorMessage.M014.value)) {
        errorObject = new ApiError(Code.B003, Object.keys(error.errors))
      }

      return res.status(400).json({ ...errorObject })
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

const deleteBook = async (req, res) => {
  res.status(404).send('hola')
}

const patchBook = async (req, res) => {
}

module.exports = {
  getBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
  patchBook
}
