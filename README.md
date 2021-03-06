<p align="center">
  <a href="https://mit-license.org/"> 
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" />
  </a>
  <a href="https://github.com/albamr09/bookish-node/actions"> 
    <img src="https://github.com/albamr09/bookish-node/workflows/Build%20and%20Test/badge.svg" alt="Build Status"/>
  </a>
</p>

# bookish-node 

Simple Book API.

## Dependencies

| Name | Version |
|:---|:---:|
|**express**|4.17.1|
|**mongoose**|6.0.8|
|**jsonwebtoken**|8.5.1|

### Development 

|Name|Version|
|:---|:---:|
|**supertest**|6.1.6|
|**jest**|27.2.4|
|**eslint**|7.32.0|
|**nodemon**|2.0.13|

## Startup

### Production

To build the production image with:

```console
$ docker-compose build
```

To start the application with:

```console
$ docker-compose up
```

## Development 

To build the images in the development environment:

```console
$ docker-compose -f ../docker-compose.dev.yml build
```

Or start the development server with:

```console
$ docker-compose -f ../docker-compose.dev.yml up
```

## Documentation

## Project Set Up

[Set Up](docs/setup.md)

## Configuration Specification

[Configuration](docs/config.md)

