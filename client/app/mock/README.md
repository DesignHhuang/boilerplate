## client / app / mock

This folder contains a mock backend for your application. You can add new mock modules as needed.

The mock backend can be enabled or disabled by adding or removing the 'MyApp.Mock.Backend' module as a dependency in the main application module file app.js.

The file backend.mock.js is the starting point for the mock backend and also contains http interceptors to log all mock HTTP requests and responses in the console.
