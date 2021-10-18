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

We now derive the `Data Model` for `MongoDB`.

- User

```json
{
  _id: <ObjectId>,
  email: <String>,
  password: <String>,
  name: <String>
}
```

- Book 

```json
{
  _id: <ObjectId>,
  isbn: 
  title: <String>,
  year_published: <Year>,
  publisher: <String>,
  edition: <Integer>,
  Language: <[Integer]>,
  Genre: <[Integer]>,
  author: <[Author._id]>
}
```

- Author

```json
{
  _id: <ObjectId>,
  name: <String>,
  birth_date: <ISODate>,
}
```
