
/**
 * Module definition and dependencies
 */
angular.module('Directives.input.Directive', [])

/**
 * Directive
 */
.directive('input', function() {
  return {
    require: [
      '?ngModel'
    ],
    link: function(scope, element, attrs, ngModel) {

      //Array? TODO: figure out why we're getting an array here
      if (angular.isArray(ngModel)) {
        ngModel = ngModel[0];
      }

      /**
       * Helper to apply URL handling
       */
      function applyUrlHandling() {

        //URL regex
        //jscs: disable maximumLineLength
        var URL_REGEXP = /^((?:http|ftp)s?:\/\/)(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[\/?]\S+)$/i;

        //Silently prefixes schemeless URLs with 'http://' when
        //converting a view value to model value.
        ngModel.$parsers.unshift(function(value) {
          if (!URL_REGEXP.test(value) && URL_REGEXP.test('http://' + value)) {
            return 'http://' + value;
          }
          else {
            return value;
          }
        });

        //Validator
        ngModel.$validators.url = function(value) {
          return ngModel.$isEmpty(value) || URL_REGEXP.test(value);
        };
      }

      //Apply for URL type input fields
      if (ngModel && attrs.type === 'url') {
        applyUrlHandling();
      }
    }
  };
});
