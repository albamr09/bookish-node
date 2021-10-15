# Configuration

1. [Dockerfile](#dockerfile)
    1. [Docker ignore](#dockerignore)
2. [Docker Compose](#dockercompose)
    1. [App](#compose_app)
    2. [MongoDB](#compose_db)
    3. [Swagger](#compose_swagger)
3. [.env](#env)

## `Dockerfile`<a name="dockerfile"></a>

```dockerfile
FROM alpine:latest
MAINTAINER albamr09

# Install dependencies
RUN apk add --no-cache nodejs npm

# Add common user
RUN adduser -D user

# Create app directory
WORKDIR /home/user/src/
# Change permissions
RUN chown -R user:user /home/user/src/
RUN chmod -R 755 /home/user/src/

USER user 

# Copy with user as owner
COPY --chown=user:user ./package*.json ./

# Install app dependencies
RUN npm install

# Copy and override src folder
COPY . .
```

- We use the `Alpine` image as the container that will host our application.
- We install `Node.js` and `NPM`.
- We specify they user who maintains this container with the keyword `MAINTAINER`.
- We create a user, as to avoid running as root.
- We create and set our working directory to `/home/user/src`.
- We change the permissions of this folder.
- With earlier versions of `npm` the file `package-lock.json` is not created we copy it from our project's root folder along with `package.json` to install the dependencies needed. (Observe: we copy setting the user as the owner to avoid permission related errors)
- We install the dependencies with `npm install`.
- We copy all the source code with `COPY ./src .`

### Docker ignore <a name="dockerignore"></a>

Once we have our `Dockerfile` created we create a `.dockerignore` file, so we do not copy our `node_modules` folder to the image:

```.dockerignore
node_modules/
npm-debug.log
./Dockerfile
```

## `Docker Compose` <a name="dockercompose"></a>

We use version 3 of `Docker Compose`. For more information check the [Compose Specification](https://github.com/compose-spec/compose-spec/blob/master/spec.md)

### App <a name="compose_app"></a>

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
  app:
    container_name: 'bookish_node_dev'
    build:
      context: ./src/
    ports:
      - "${PORT}:8000"
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

### MongoDB <a name="compose_db"></a>

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
    container_name: "mongodb"
    image: mongo:latest
    hostname: mongodb
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
      # Map mongo config file to /etc/mongo
      - ${DB_CONFIG}:/etc/mongo/
      # Copy the database initialization script
      - ${DB_INIT}:/docker-entrypoint-initdb.d/
      # Make data persist on local folder named ./mongo-volume
      - ${DB_DATA}:/data/db
    # Specify config file
    command: ["-f", "/etc/mongo/mongod.conf"]
```

#### Initialize database

We create a script that lets us create the user and the database, denoted by `entrypoint.sh` 

```sh
#!/usr/bin/env bash

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

#### MongoDB Config file

And we also create a configuration file called `mongod.conf` which contains:

```conf
# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
```

### Swagger UI <a name="compose_swagger"></a>

- `image`: use `swagger`'s pre-built image to deploy the API documentation.
- `ports`: map the container's 8080 to our local machine `${SWAGGER_PORT}` port.
- `volumes`: mount the local directory that contains the `API` specification file on `/usr/share/nginx/html/doc`
- `API_URL`: set the environment variable that tells `swagger` the name of the specification file.

```yaml
  swagger-ui:
    image: swaggerapi/swagger-ui
    container_name: swagger_ui
    ports:
      - "${SWAGGER_PORT}:8080"
    volumes:
      - ${SWAGGER_DIR}:/usr/share/nginx/html/doc
    environment:
      API_URL: ${SWAGGER_API_URL}
```

### `.env` <a name="env"></a>

Our `.env` file contains:

- **App** environment variables: port, host.
- **Database** environment variables: admin name and password, user name and password, database name, configuration file path, etc.
- **Swagger** environment variables: port of the server, local directory with the API specification file, name of the specification file.


### Configure Travis CI

- `language`: The language in which the tests are written in is `Node.js`.
- `node_js`: We use the latest stable version.
- `services`: Indicate that we are using `Docker`.
- `script`: Run the tests.

```conf
language: node_js
node_js:
 - 'stable' 

services:
  - docker

script:
  - docker-compose -f docker-compose.dev.yml run app sh -c "npm test && npm run lint"
```

Note that we need to define all of the environment variables that we are using in `Docker Compose`. For that, go to the `build` > `Settings` > `Environment Variables` and add all of the same environment variables.
