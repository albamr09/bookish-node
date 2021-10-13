# bookish-node 

---

[![Build Status](https://app.travis-ci.com/albamr09/bookish-node.svg?branch=main)](https://app.travis-ci.com/albamr09/bookish-node) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://mit-license.org/)

## Dependencies

- express
- mongoose
- jsonwebtoken

### Development 

- supertest
- jest
- eslint

## Set Up

We create the folder than will contain the source code:

```
$ mkdir ./src
```

We go to `src` and we create app with all of the defaults 

```console
$ cd ./src && npm init -y
```

### Install dependencies

```console 
$ npm install express mongoose jsonwebtoken
```

```console 
$ npm install --save-dev supertest jest eslint
```

### Configure `eslint`

In order to do that we execute from our project's root folder:

```console
$ ./node_modules/.bin/eslint --init
```

And we setup our linter to our needs.

### Configure `package.json`

We modify the `scripts` object of `package.json`:

```json
  "scripts": {
      "start": "node app",
      "dev": "node app",
      "test": "jest --passWithNoTests"
  },
```

So we have three commands:

- `start`: Start our application with the environment variables.
- `dev`: Start our application. 
- `test` Use jest to run our tests.

### Configure `Docker`

First we create the following `Dockerfile` on our root project's folder, not inside the source code folder.

```dockerfile
FROM alpine:latest
MAINTAINER albamr09

# Add common user
RUN useradd --create-home --shell /bin/bash user

# Create app directory
WORKDIR /home/user/src/
# Change permissions
RUN chown -R user:user /home/user/src/
RUN chmod -R 755 /home/user/src/

USER user 

# Copy with user as owner
COPY --chown=user:user ./src/package*.json ./

# Install app dependencies
RUN npm install

# Copy and override src folder
COPY ./src .

# Container exposed network port number
EXPOSE ${PORT}
```

Where we use the `Alpine` image as the container that will host our application. We, the install `Node.js` and `NPM` and we specify they user who maintains this container with the keyword `MAINTAINER`.

Next, we create a user, as to avoid running as root and then create and set our working directory to `/home/user/src`, and we change the permissions of this folder. 

Because with earlier versions of `npm` (4 or less) the file `package-lock.json` is not created we copy it from our project's root folder along with `package.json` in order to install the dependencies needed. Note that we copy setting user as the owner to avoid permission related errors. 

Then we install the dependencies with `npm install` and we copy all the source code with `COPY ./src .`. And finally we also export our network port with `EXPOSE`, to allow connections from outside.

Once we have our `Dockerfile` created we create a `.dockerignore` file, so we do not copy our `node_modules` folder to the image:

```.dockerignore
*/node_modules
*/npm-debug.log
```
Now we build the image with the following command:

```console
$ docker build .
```

To run a container, without specifying any configuration:

```console
$ docker run <image-name>
```

To list the images:

```console
$ docker image ls 
```

To list the containers:

```console 
$ docker container ls 
```

To log in into a container:

```console
$ docker exec -it <container-name> bash
```

### Configure `Docker Compose`

So now we are going to configure our `Docker Compose`, therefore we create the file `docker-compose.dev.yml` in our root folder. Check the [Compose Specification](https://github.com/compose-spec/compose-spec/blob/master/spec.md)

#### App

First, we define the service for our `Node.js` app.

- `container_name`
- `build`: defines how to create the `Docker` image service. The `context` property defines the path where the `Dockerfile` is.
- `ports`: exposes container ports, it follows the syntax `[HOST:]CONTAINER[/PROTOCOL]`.
  - `HOST`: `[IP:](port | range)`
  - `CONTAINER`: port or range
  - `PROTOCOL`: tcp or udp. 
- `volumes`: defines mount host paths or named volumes that must be accessible by service containers. If it is only accessible by one service, it may be declared as part of the service definition.
- `command`: execute a given command.
- `enviroment`: define environment variables for the service.
- `depends_on`: waits for the `db` service to start.

```yml
version: "3"

services:
  app:
    container_name: 'bookish_node'
    build:
      context: .
    ports:
      - "${PORT}:${PORT}"
    volumes:
      - ./src/:/home/user/src/
      - /home/user/src/node_modules
    command: >
      sh -c "npm run dev"
    environment:
      - HOST=${HOST}
      - PORT=${PORT}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_PORT=${DB_PORT}
      - DB_URI=${DB_URI}
    depends_on:
      - db
```

#### Database

Next we have our `db` service that holds our `MongoDB` image:

- `image`: We pull the `mongo` from `Docker Hub`.
- `restart`: defines the policy that the platform will apply on container termination
   - `always`: always restart until it is removed
   - `on-failure`: restart when the exit code of the container indicates an error.
- `environment`: These differ from the ones defined for `app`, as this are internally used by `MongoDB`. 
- `ports`: Map ports between the container and the host.
- `volumes`: Define mount host paths that have to accessible to the database.
- `command`: Tell `MongoDB` to use our configuration file.

```yml
  db:
    image: mongo
    restart: always
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${DB_ROOT_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MONGO_INITDB_USERNAME=${DB_USER}
      - MONGO_INITDB_PASSWORD=${DB_PASSWORD}
      - MONGO_INITDB_DATABASE=${DB_NAME}
    ports:
      - '${DB_PORT}:27017'

    volumes:
      # Make data persist on local folder named ./mongo-volume
      - ${DB_DATA}:/data/db
      # Copy the database initialization script
      - ${DB_INIT}:/docker-entrypoint-initdb.d/init-mongo.sh 
        # Map mongo config file to /etc/mongo
      - ${DB_CONFIG}:/etc/mongo/
    # Specify config file
    command: ["-f", "/etc/mongo/mongod.conf"]
```

##### `MongoDB` Commands

To log into `MongoDB` with the created user and database:

```console
$ mongo -u <your username> -p <your password> \\
                --authenticationDatabase <your database name>
```

or 

```console
$ mongo -u <your username> \\ 
        --authenticationDatabase <your database name>
```

To connect to the database use the following `URI`:

```uri
mongodb://YourUsername:YourPasswordHere@db:27017/your-database-name
```

Where `db` is the `docker-compose` service name for the database.

#### External resources

First of all we create the file that will allow `MongoDB` to be persistent:

```console
$ mkdir ./.docker/mongo-volume/
```

We, then create a script that lets us create the user and the database, denoted by `init-mongo.sh`. 

```sh
mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);

    var user = '$MONGO_INITDB_USERNAME';
    var passwd = '$MONGO_INITDB_PASSWORD';
    db.createUser({user: user, pwd: passwd, roles: ["readWrite"]});
EOF
```

And we also create a configuration file called `mongod.conf` which contains:

```conf
# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
```

#### Commands

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

### Configure `.env`

We create the file `.env` in our root folder and we add our `MongoDB` database credentials as well as the `HOST` and `PORT` of our application and the path of configuration files.

### Configure `.gitingore`

We add the file `.env` and the folder where the dependencies are stored (`node_modules`) to the `.gitingore` file, as well our `Docker` secrets.

```.gitingore
.env
src/node_modules/
*-passwd
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
  - ./test.sh 
```

An in our `Repositories` section on [Travis CI](https://www.travis-ci.com), your activate your repository.

We specify that we use `docker` and then we run our `test.sh` script. Note that it is needed to specify the environment variables for our build on the `Travis CI` client (only `PORT` and `DB_PORT` are needed).
