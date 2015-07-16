
/**
 * Specifications
 */
describe('Nl2br filter', function() {

  //Load module
  beforeEach(module('Filters.Text.Nl2br.Filter'));

  //Inject filter
  var nl2br;
  beforeEach(inject(function($filter) {
    nl2br = $filter('nl2br');
  }));

  //Newlines
  describe('newlines', function() {
    it('should replace a single newline with a br tag', function() {
      expect(nl2br('\n')).toBe('<br>');
    });
    it('should replace two newlines with two br tags', function() {
      expect(nl2br('\n\n')).toBe('<br><br>');
    });
    it('should replace a single newline within text by a br tag', function() {
      expect(nl2br('a\nb')).toBe('a<br>b');
    });
    it('should replace two newlines within text by two br tags', function() {
      expect(nl2br('a\n\nb')).toBe('a<br><br>b');
    });
  });

  //With carriage returns
  describe('with carriage returns', function() {
    it('should replace newlines with surrounded carriage returns by br tags', function() {
      expect(nl2br('\n\r')).toBe('<br>');
      expect(nl2br('\r\n')).toBe('<br>');
    });
    it('should replace a single carriage return with a br tag', function() {
      expect(nl2br('\r')).toBe('<br>');
    });
    it('should replace a mixed string properly', function() {
      expect(nl2br('a\rb\r\nc\nd\n\re')).toBe('a<br>b<br>c<br>d<br>e');
    });
  });

  //Numbers
  describe('numbers', function() {
    it('should accept numbers and return them as a string', function() {
      expect(nl2br(123)).toBe('123');
      expect(nl2br(1.23)).toBe('1.23');
      expect(nl2br(0)).toBe('0');
      expect(nl2br(-123)).toBe('-123');
    });
  });

  //Invalid input
  describe('invalid input', function() {
    it('should return an empty string for empty strings', function() {
      expect(nl2br('')).toBe('');
    });
    it('should return an empty string for booleans', function() {
      expect(nl2br(true)).toBe('');
      expect(nl2br(false)).toBe('');
    });
    it('should return an empty string for null', function() {
      expect(nl2br(null)).toBe('');
    });
    it('should return an empty string for undefined', function() {
      expect(nl2br(null)).toBe('');
    });
    it('should return an empty string for objects', function() {
      expect(nl2br({})).toBe('');
    });
    it('should return an empty string for arrays', function() {
      expect(nl2br([])).toBe('');
    });
  });
});
