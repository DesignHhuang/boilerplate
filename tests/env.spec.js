
/**
 * Specifications
 */
describe('Environment getter', function() {

  //Environment
  var env;

  //Tests
  it('should get the environment from the process.env.NODE_ENV var', function() {
    process.env.NODE_ENV = 'development';
    env = require('../src/env');
    expect(env).toBe('development');
  });
});
