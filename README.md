# Meanie - Boilerplate

[![npm version](https://img.shields.io/npm/v/meanie-boilerplate.svg)](https://www.npmjs.com/package/meanie-boilerplate)
[![node dependencies](https://david-dm.org/meanie/boilerplate.svg)](https://david-dm.org/meanie/boilerplate)
[![github issues](https://img.shields.io/github/issues/meanie/boilerplate.svg)](https://github.com/meanie/boilerplate/issues)
[![codacy](https://img.shields.io/codacy/465dea03af9f4b6e9fc69b21c1d8c961.svg)](https://www.codacy.com/app/meanie/boilerplate)
[![gitter](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/meanie/meanie?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Meanie is a boilerplate for developing, testing and building full-stack modular javascript applications using MEAN (MongoDB, Express, AngularJS and Node.js). Meanie is powered by the Gulp task runner.

This package/repository contains the boilerplate framework for new [Meanie](https://github.com/meanie/meanie) projects. To find out more about the Meanie CLI, please check the [Meanie CLI GitHub repository](https://github.com/meanie/meanie) or the [Meanie CLI npm page](https://www.npmjs.com/package/meanie).

## Installation
The boilerplate is automatically installed when you create a new project using the [Meanie CLI](https://www.npmjs.com/package/meanie) `create` command:

```shell
# Install meanie CLI globally
npm install -g meanie

# Create a new Meanie project in the current directory
meanie create

# Create a new Meanie project in a given directory
meanie create ~/some/path
```

## Folder structure
The following is an outline of the folder structure of the Meanie boilerplate:

```shell
# Client side code and assets
├─ client

  # This is where your client side Angular application resides.
  # Everything in this folder should be explicitly specific to
  # your application.
  ├─ app

    # The home module of your application. Feel free to rename to
    # anything that suits better (e.g. index, dashboard, ...)
    ├─ home

    # This folder contains the layout module for you application.
    # It's a good place to store all common stylesheets and templates.
    ├─ layout

    # The navigation module, for application wide navigation logic.
    ├─ nav

    # Any application specific, but shared services, directives and
    # filters that don't belong to one specific module reside here.
    └─ shared

  # Static assets for your client application go here. This is a good
  # place to store fonts, images, audio files, etc. Anything in here
  # will be copied as-is to the public folder.
  ├─ static

  # 3rd party resources reside here. Bower is configured to download
  # resources into this folder. It is excluded from version control.
  └─ vendor

# Server side code and assets
├─ server

  # This is where your server side Node/Express application resides.
  # Everything in this folder should be specific to your application.
  ├─ app

  # Common (non packaged) node modules are arranged in this folder.
  # Everything in here is not specific to a particular application
  # and could be recycled in other projects.
  └─ common

# Environment configuration (shared by client and server)
├─ env

# Public folder for compiled assets (generated by Gulp)
└─ public

  # Compiled CSS stylesheets
  ├─ css

  # Compiled Javascript sources
  ├─ js

  # Fonts (copied over from client/static)
  ├─ fonts

  # Images (copied over from client/static)
  └─ images
```

## Issues & feature requests
Please report any bugs, issues, suggestions and feature requests in the appropriate issue tracker:
* [Meanie Boilerplate issue tracker](https://github.com/meanie/boilerplate/issues)
* [Meanie CLI issue tracker](https://github.com/meanie/meanie/issues)

## Contributing
If you would like to contribute to Meanie, please check out the [Meanie contributing guidelines](https://github.com/meanie/meanie/blob/master/CONTRIBUTING.md).

## License
(MIT License)

Copyright 2015, [Adam Buczynski](http://adambuczynski.com)
