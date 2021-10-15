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

And we setup our linter to our needs. The configuration is saved in `./src/.eslintrc.json`.

### Configure `package.json`

We modify the `scripts` object of `package.json`:

```json
  "scripts": {
    "start": "node server",
    "dev": "nodemon server",
    "lint": "./node_modules/.bin/eslint .",
    "localTest": "jest --passWithNoTests --watchAll --no-cache --detectOpenHandles",
    "test": "jest --passWithNoTests --no-cache"
  }
```

So we have three commands:

- `start`: Start our application.
- `dev`: Start our application with live update. 
- `lint`: Run our linter.
- `localTest` Use jest to run our tests listening for updates.
- `test` Use jest to run our tests without listening for updates.

