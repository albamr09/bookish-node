# bookish-node

## Dependencies

- express
- mongoose
- jsonwebtoken

### Development 

- dotenv
- nodemon
- supertest
- jest

## Set Up

Create app with all of the defaults 

```console
$ npm init -y
```

### Install dependencies

```console 
$ npm install express mongoose jsonwebtoken
```

```console 
$ npm install --save-dev dotenv nodemon supertest jest
```

### Configure `package.json`

We modify the `scripts` object of `package.json`:

```json
scripts: {
    start: "node index"
    dev: "nodemon index"
    test: "jest"
}
```

### Create database

### Configure `.env`

We create the file `.env` in our root folder and we add our `MongoDB` database credentials.

### Configure `.gitingore`

We add the file `.env` and the folder where the dependencies are stored (`node_modules`)to the `.gitingore` file:

```.gitingore
.env
node_modules/
```

### Configure Travis CI



