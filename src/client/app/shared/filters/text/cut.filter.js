
/**
 * Module definition and dependencies
 */
angular.module('Filters.Text.Cut.Filter', [])

/**
 * Filter definition
 */
.filter('cut', function() {
  return function(text, max, onWords, tail) {

    //Must have text
    if (!text) {
      return '';
    }

    //Max number of characters
    max = parseInt(max, 10);
    if (!max || text.length <= max) {
      return text;
    }

    //Concatenate
    text = text.substr(0, max);

    //Cut on words?
    if (onWords) {
      var lastspace = text.lastIndexOf(' ');
      if (lastspace !== -1) {
        text = text.substr(0, lastspace);
      }
    }

    //Tail to append?
    return text + (tail || '');
  };
});
