const mongoose = require('mongoose')

const { Author, ErrorMessage } = require('../../models/index')

const authorData = { name: 'test', birth_date: new Date() }

beforeAll(async () => {
    mongoose.connect(process.env.DB_URI)
    await Author.deleteMany()
})

afterAll(async () => {
    await mongoose.connection.close()
})

beforeEach(async () => {
    await Author.deleteMany()
})

describe('Author Model Tests', () => {
    it('Create author success', async () => {
        const author = await new Author(authorData).save()
    
        expect(author._id).toBeDefined()
        expect(author.name).toBe(authorData.name)
        expect(author.birth_date).toBe(authorData.birth_date)
    })

    it('Create author without required name', async () => {
        const newAuthorData = { ...authorData }
        delete newAuthorData.name

        let error

        try {
            error = await new Author(newAuthorData).save()
        } catch (err) {
            error = err
        }

        expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(error.toString()).toEqual(expect.stringContaining(ErrorMessage.M012.value))
        expect(error.errors.name).toBeDefined()
    })
})