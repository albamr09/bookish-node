# bookish-node

## Dependencies

- express
- mongoose
- jsonwebtoken

### Development 

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
$ npm install --save-dev supertest jest
```

### Configure `package.json`

We modify the `scripts` object of `package.json`:

```json
"scripts": {
    "start": "node app",
    "dev": "nodemon app",
    "test": "jest"
}
```

### Configure `Docker`

First we create the following `dockerfile`:

```dockerfile
FROM node:14

# Add common user
RUN useradd --create-home --shell /bin/bash user

# Create app directory
WORKDIR /home/user/app
# Change permissions
RUN chown -R user:user /home/user/app
RUN chmod -R 755 /home/user/app

USER user 

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
```

Where we use the latest `LTS` version of `Node.js` (14) as the image to build, which comes with `Node.js` and `NPM` installed. 

We create a user, as to avoid running as root and then create and set our working directory to `/home/user/app`. 

Because with earlier versions of `npm` (4 or less) the file `package-lock.json` is not created we copy it from our project's root folder. Then we install the dependencies with `npm install` and we copy all the source code with `COPY . .`.

Once we have our `Dockerfile` created we create a `.dockerignore` file, so we do not copy our `node_modules` folder to the image:

```.dockerignore
node_modules
npm-debug.log
```

And we build the image with the following command:

```console
$ docker build .
```

### Configure `Docker Compose`

```yml
version: "3"

services:
  app:
    build:
      context: .
    ports:
      - "8000:8000"
    volumes:
      - .:/usr/src/app
    command: >
      sh -c "npm run dev"
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

We create the `Travis CI` configuration file `.travis.yml`:

```conf
language: node_js
node_js:
 - 'stable' 
install: npm install
script: npm test
```

An in our `Repositories` section on [Travis CI](https://www.travis-ci.com), your activate your repository.

