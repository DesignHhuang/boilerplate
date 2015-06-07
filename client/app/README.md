## client / app

This is where you client application logic resides. Everything in this folder is going to be specific to your application.

The main application files are all located in this folder:

#### app.js
This file is the core module and starting point of your application. It contains the main dependencies of your application, as well as technical configuration and runtime logic.

#### app.ctrl.js
The main application controller.

#### app.config.js
Contains business logic configuration, which has been separated from the more tecnical configuration present in app.js.

#### app.errors.js
Contains error definitions and exception handling logic.

#### app.global.js
A place to define global functions/variables or to extend javascript's functionality.

#### app.spec.js
Application level unit tests.

#### app.html
The main (index) template for your application.

#### app.less
The main LESS stylesheet for your application. From this file, all other LESS files are loaded.
