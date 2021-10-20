## Relational Model

This section illustrates the relational model resulting from entity relationship model. Here bold keywords signal the key of a relation and italic signals the foreign key. 

---

User(__id__, email, password, name)

Book(__id__, isbn, title, year\_published, publisher, edition) 

Author(__id__, name, birth\_date)

Language(*book_id*, **language**)

Genre(*book_id*, **genre**)

AuthorWrote(*book_id*, *author_id*)

## MongoDB Data Model

We now derive the `Data Model` for `MongoDB`, and we specify the restrictions, (i.e. if the attribute is required and must be validated).

- User

```json
{
  _id: <ObjectId>,
  email: <String>,
  password: <String>,
  name: <String>
}
```

    - email: required and valid
    - password: required

- Book 

```json
{
  _id: <ObjectId>,
  isbn: <String>
  title: <String>,
  year_published: <Year>,
  publisher: <String>,
  edition: <Integer>,
  Language: <[String]>,
  Genre: <[String]>,
  author: <[Author._id]>
}
```

    - isbn: required valid unique
    - title: required
    - year_published: valid
    - language: required valid 
    - genre: valid
    - author: required

- Author

```json
{
  _id: <ObjectId>,
  name: <String>,
  birth_date: <ISODate>,
}
```

    - name: required
    - birth_date: valid
