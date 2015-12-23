
/**
 * Specifications
 */
describe('Conditional filter', function() {

  //Load module
  beforeEach(module('Shared.Conditional.Filter'));

  //Inject filter
  var conditional;
  beforeEach(inject(function($filter) {
    conditional = $filter('conditional');
  }));

  //Tests
  describe('truthy values', function() {
    it('should return the first parameter when input is true', function() {
      expect(conditional(true, 1, 2)).toBe(1);
    });
    it('should return the first parameter when input is a truthy string', function() {
      expect(conditional('a', 1, 2)).toBe(1);
    });
    it('should return the first parameter when input is a truthy integer', function() {
      expect(conditional(1, 1, 2)).toBe(1);
    });
    it('should return the first parameter when input is an object', function() {
      expect(conditional({}, 1, 2)).toBe(1);
    });
    it('should return the first parameter when input is an array', function() {
      expect(conditional([], 1, 2)).toBe(1);
    });
  });

  //Falsey values
  describe('falsey values', function() {
    it('should return the second parameter when input is false', function() {
      expect(conditional(false, 1, 2)).toBe(2);
    });
    it('should return the second parameter when input is an empty string', function() {
      expect(conditional('', 1, 2)).toBe(2);
    });
    it('should return the second parameter when input is 0', function() {
      expect(conditional(0, 1, 2)).toBe(2);
    });
    it('should return the second parameter when input is null', function() {
      expect(conditional(null, 1, 2)).toBe(2);
    });
    it('should return the second parameter when input is undefined', function() {
      expect(conditional(undefined, 1, 2)).toBe(2);
    });
  });
});
