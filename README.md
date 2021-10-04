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
      "dev": "HOST=0.0.0.0 node app",
      "test": "jest --passWithNoTests"
  },
```

So we have three commands:

- `start`: Start our application with the environment variables.
- `dev`: Start our application on `0.0.0.0:8000`
- `test` Use jest to run our tests.

### Configure `Docker`

First we create the following `dockerfile`:

```dockerfile
FROM node:14
MAINTAINER albamr09

# Add common user
RUN useradd --create-home --shell /bin/bash user

# Create app directory
WORKDIR /home/user/src/
# Change permissions
RUN chown -R user:user /home/user/src/
RUN chmod -R 755 /home/user/src/

USER user 

# Install app dependencies
COPY ./src/package*.json ./

RUN npm install

# Copy and override src folder
COPY ./src .
```

Where we use the latest `LTS` version of `Node.js` (14) as the image to build, which comes with `Node.js` and `NPM` installed. Then we specify they user who maintains this container.

Next, we create a user, as to avoid running as root and then create and set our working directory to `/home/user/src`. 

Because with earlier versions of `npm` (4 or less) the file `package-lock.json` is not created we copy it from our project's root folder along with `package.json` in order to install the dependencies needed. Then we install the dependencies with `npm install` and we copy all the source code with `COPY ./src .`.

Once we have our `Dockerfile` created we create a `.dockerignore` file, so we do not copy our `node_modules` folder to the image:

```.dockerignore
*/node_modules
*/npm-debug.log
```

And we build the image with the following command:

```console
$ docker build .
```

### Configure `Docker Compose`

So now we are going to configure our `Docker Compose`, therefore we create the file `docker-compose.yml` in our root folder.

```yml
version: "3"

services:
  app:
    build:
      context: .
    ports:
      - "${PORT}:${PORT}"
    volumes:
      - ./src/:/home/user/src/
      - /home/user/src/node_modules
    command: >
      sh -c "npm run dev"
    env_file:
      - .env
```

Now we build the image with:

```console
$ docker-compose build --no-cache
```

And we start the application with:

```console
$ docker-compose run app sh -c "npm start"
```

Or start the development server with:


```console
$ docker-compose up
```

### Create database

### Configure `.env`

We create the file `.env` in our root folder and we add our `MongoDB` database credentials.

### Configure `.gitingore`

We add the file `.env` and the folder where the dependencies are stored (`node_modules`) to the `.gitingore` file:

```.gitingore
.env
src/node_modules/
```

### Configure Travis CI

We create the `Travis CI` configuration file `.travis.yml`:

```conf
language: node_js
node_js:
 - 'stable' 

services:
  - docker

script:
  - docker-compose run app sh -c "npm test"
  
```

Set in the `Travis CI` client the `HOST` and `PORT` environment variables.
An in our `Repositories` section on [Travis CI](https://www.travis-ci.com), your activate your repository.

