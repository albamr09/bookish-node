FORMAT: 1A
HOST: https://api.example.com/v1

# Bookish API
# Introduction This is a simple book API


## Authentication
This API uses JSON Web Tokens for its authentication.

The parameters that are needed to be sent for this type of authentication are as follows:
+ `JWTHeaderName`
+ `JWTAcquireURL`
+ `JWTDestroyURL`

# Group Users

Operations available to users

## Status [/status]

### getStatus [GET]
You get the status of the `API`.

+ Response 200 (application/json)

        The `API`'s status was retrieved successfully.

    + Attributes (string)




## Books [/books{?limit,title,author,publisher,language,genre}]

### getBooks [GET]
You get the list of `Books` that match the query.
+ Parameters
    + limit (number, optional)

        The number of `Books` to show.

        + Sample: 1
    + title (string, optional)

        The title of the `Book`.

        + Sample: City of Nebula
    + author (string, optional)

        The name of the author of the `Book`.

        + Sample: Isaac Asimov
    + publisher (string, optional)

        The name of the publisher of the `Book`.

        + Sample: Penguin Random House
    + language (enum[string], optional)

        The language in which the `Book` is written.

        + Members
            + `chinese` 
            + `spanish` 
            + `english` 
            + `hindi` 
            + `arabic` 
            + `portuguese` 
            + `bengali` 
            + `russian` 
            + `japanese` 
            + `french` 
            + `german` 

    + genre (enum[string], optional)

        The main theme of the `Book`.

        + Members
            + `fantasy` 
            + `science_fiction` 
            + `adventure` 
            + `romance` 
            + `horror` 
            + `thriller` 
            + `LGTBQ` 
            + `mistery` 
            + `science` 


+ Response 200 (application/json)

        The list was retrieved successfully.

    + Attributes (Books Response)



+ Response 400 (application/json)

        The request is not correct

    + Attributes (Error)



+ Response 401 (application/json)

        Unauthorized

    + Attributes (Error)



+ Response 404 (application/json)

        The specified resource was not found

    + Attributes (Error)




## Books [/books]

### createBook [POST]
A new `Book` is stored in the database with the data provided.

+ Request (application/json)

    + Attributes (BookProperties)



+ Response 200 (application/json)

        Book updated successfully.

    + Attributes (SuccessBook)



+ Response 400 (application/json)

        The request is not correct

    + Attributes (Error)



+ Response 401 (application/json)

        Unauthorized

    + Attributes (Error)




## Books By Id [/books/{id}]

+ Parameters
    + id (string, required)

        Book ID

        + Sample: 507f1f77bcf86cd799439011

### getBookById [GET]
You get detailed information about the `Book` with the specified id, if it exists.

+ Response 200 (application/json)

        get the book

    + Attributes (SuccessBook)



+ Response 400 (application/json)

        The request is not correct

    + Attributes (Error)



+ Response 401 (application/json)

        Unauthorized

    + Attributes (Error)



+ Response 404 (application/json)

        The specified resource was not found

    + Attributes (Error)



### updateBook [PUT]
All of the information about the `Book` is replaced by the data provided.

+ Request (application/json)

    + Attributes (BookProperties)



+ Response 200 (application/json)

        Book updated successfully.

    + Attributes (SuccessBook)



+ Response 400 (application/json)

        The request is not correct

    + Attributes (Error)



+ Response 401 (application/json)

        Unauthorized

    + Attributes (Error)



+ Response 404 (application/json)

        The specified resource was not found

    + Attributes (Error)



### deleteBook [DELETE]
The `Book` identified, if it exists, is removed.

+ Response 204 

        Book deleted successfully.




+ Response 400 (application/json)

        The request is not correct

    + Attributes (Error)



+ Response 401 (application/json)

        Unauthorized

    + Attributes (Error)



+ Response 404 (application/json)

        The specified resource was not found

    + Attributes (Error)



### patchBook [PATCH]
Some of the information about the `Book` is replaced by the data provided.

+ Request (application/json)

    + Attributes (BookProperties)



+ Response 200 (application/json)

        Book updated successfully.

    + Attributes (SuccessBook)



+ Response 400 (application/json)

        The request is not correct

    + Attributes (Error)



+ Response 401 (application/json)

        Unauthorized

    + Attributes (Error)



+ Response 404 (application/json)

        The specified resource was not found

    + Attributes (Error)




## Users Login [/users/login]

### logUser [POST]
The user is logged in with its credentials.

+ Request (application/json)

    + Attributes (LogUser)



+ Response 200 (application/json)

        User logged successfully.

    + Attributes (Users Login Response)



+ Response 400 (application/json)

        The request is not correct

    + Attributes (Error)




## Users Signup [/users/signup]

### createUser [POST]
A new `User` is created with the data provided.

+ Request (application/json)

    + Attributes (NewUser)



+ Response 200 (application/json)

        User logged successfully.

    + Attributes (User)



+ Response 400 (application/json)

        The request is not correct

    + Attributes (Error)





# Data Structures

## BasicUser (object)


### Properties
+ `email`: `marco@email.com` (string, required) 


## LogUser (object)


### Properties
+ `password`: `pass123` (string, required) 
+ `email`: `marco@email.com` (string, required) 


## NewUser (object)


### Properties
+ `name`: `Marco` (string, optional) 
+ `password`: `pass123` (string, required) 
+ `email`: `marco@email.com` (string, required) 


## User (object)


### Properties
+ `id`: `507f1f77bcf86cd799439011` (string, required) 
+ `name`: `Marco` (string, optional) 
+ `email`: `marco@email.com` (string, required) 


## BookProperties (object)


### Properties
+ `isbn`: `978-3-16-148410-0` (string, required) 
+ `title`: `City of Nebula` (string, required) 
+ `edition`: `1` (number, optional) 
+ `year_published`: `1984` (string, optional) 
+ `author` (Author, optional) 
+ `publisher`: `Penguin Random House` (string, optional) 
+ `language` (enum[string], optional) 
    + `chinese`
    + `spanish`
    + `english`
    + `hindi`
    + `arabic`
    + `portuguese`
    + `bengali`
    + `russian`
    + `japanese`
    + `french`
    + `german`
+ `genre` (enum[string], optional) 
    + `fantasy`
    + `science_fiction`
    + `adventure`
    + `romance`
    + `horror`
    + `thriller`
    + `LGTBQ`
    + `mistery`
    + `science`


## BasicBook (object)


### Properties
+ `isbn`: `978-3-16-148410-0` (string, required) 
+ `title`: `City of Nebula` (string, required) 
+ `author` (Author, optional) 


## Book (object)


### Properties
+ `id`: `507f1f77bcf86cd799439011` (string, required) 
+ `isbn`: `978-3-16-148410-0` (string, required) 
+ `title`: `City of Nebula` (string, required) 
+ `edition`: `1` (number, optional) 
+ `year_published`: `1984` (string, optional) 
+ `author` (Author, optional) 
+ `publisher`: `Penguin Random House` (string, optional) 
+ `language` (enum[string], optional) 
    + `chinese`
    + `spanish`
    + `english`
    + `hindi`
    + `arabic`
    + `portuguese`
    + `bengali`
    + `russian`
    + `japanese`
    + `french`
    + `german`
+ `genre` (enum[string], optional) 
    + `fantasy`
    + `science_fiction`
    + `adventure`
    + `romance`
    + `horror`
    + `thriller`
    + `LGTBQ`
    + `mistery`
    + `science`


## SuccessBook (object)


### Properties
+ `book` (Book, required) 
+ `success` (boolean, required) 


## Author (object)


### Properties
+ `id`: `507f1f77bcf86cd799439011` (string, required) 
+ `name`: `Isaac Asimov` (string, required) 
+ `birth_date`: `2017-07-21` (string, optional) 


## Error (object)


### Properties
+ `success`: `false` (boolean, required) 
+ `code` (enum[string], required) 
    + `001`
    + `002`
    + `003`
+ `message` (string, optional) 


## Books Response (object)


### Properties
+ `books` (array[BasicBook], required) 
+ `success` (boolean, required) 


## Users Login Response (object)


### Properties
+ `token`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c` (string, required) 
+ `id`: `507f1f77bcf86cd799439011` (string, required) 
+ `name`: `Marco` (string, optional) 
+ `email`: `marco@email.com` (string, required) 
