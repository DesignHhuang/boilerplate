
/**
 * Specifications
 */
describe('Boolean filter', function() {

  //Load module
  beforeEach(module('Filters.Boolean.Filter'));

  //Inject filter
  var boolean;
  beforeEach(inject(function($filter) {
    boolean = $filter('boolean');
  }));

  //Truthy values
  describe('truthy values', function() {
    it('should return true for boolean true', function() {
      expect(boolean(true)).toBe(true);
    });
    it('should return true for string \'true\'', function() {
      expect(boolean('true')).toBe(true);
    });
    it('should return true for case variations of string \'true\'', function() {
      expect(boolean('TRUE')).toBe(true);
      expect(boolean('True')).toBe(true);
      expect(boolean('TrUe')).toBe(true);
      expect(boolean('trUE')).toBe(true);
    });
    it('should return true for integer 1', function() {
      expect(boolean(1)).toBe(true);
    });
    it('should return true for string \'1\'', function() {
      expect(boolean('1')).toBe(true);
    });
  });

  //Falsey values
  describe('falsey values', function() {
    it('should return false for boolean false', function() {
      expect(boolean(false)).toBe(false);
    });
    it('should return false for string \'false\'', function() {
      expect(boolean('false')).toBe(false);
    });
    it('should return false for any other string', function() {
      expect(boolean('False')).toBe(false);
      expect(boolean('Test')).toBe(false);
      expect(boolean('1--')).toBe(false);
    });
    it('should return false for other integers', function() {
      expect(boolean(-1)).toBe(false);
      expect(boolean(0)).toBe(false);
      expect(boolean(2)).toBe(false);
    });
    it('should return false for null', function() {
      expect(boolean(null)).toBe(false);
    });
    it('should return false for undefined', function() {
      expect(boolean()).toBe(false);
    });
    it('should return false for objects', function() {
      expect(boolean({})).toBe(false);
    });
    it('should return false for arrays', function() {
      expect(boolean([])).toBe(false);
    });
  });
});
