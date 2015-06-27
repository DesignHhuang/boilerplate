
/**
 * Specifications
 */
describe('Environment getter', function() {

  //Environment
  var env = require('../src/env');

  //Tests
  it('should return an environment string', function() {
    expect(typeof env()).toBe('string');
  });
  it('should get the environment from the process.env.NODE_ENV var', function() {
    process.env.NODE_ENV = 'development';
    expect(env()).toBe('development');
  });
  it('should return another environment if dynamically changed', function() {
    process.env.NODE_ENV = 'secure';
    expect(env()).toBe('secure');
    process.env.NODE_ENV = 'test';
    expect(env()).toBe('test');
  });
  it('should default to the development environment', function() {
    process.env.NODE_ENV = '';
    expect(env()).toBe('development');
  });
});
