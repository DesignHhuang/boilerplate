
/**
 * Module definition and dependencies
 */
angular.module('Validation.EqualOrMore.Directive', [])

/**
 * Directive
 */
.directive('equalOrMore', function($parse) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {

      //Match getter
      var matchGetter = $parse(attrs.equalOrMore);
      var allowEmpty = (attrs.allowEmpty === 'true');

      //Match value helper
      function getMatchValue() {
        var match = matchGetter(scope);
        if (angular.isObject(match) && match.hasOwnProperty('$viewValue')) {
          match = match.$viewValue;
        }
        return match;
      }

      //Re-validate on change of the match value
      scope.$watch(getMatchValue, function() {
        ngModel.$validate();
      });

      //Add validator
      ngModel.$validators.equalOrMore = function(modelValue, viewValue) {

        //Get match value and our value
        var value = modelValue || viewValue;
        var match = getMatchValue();

        //Must have match
        if (match === null || !angular.isDefined(match)) {
          return true;
        }

        //Allow empty?
        if (allowEmpty && (value === null || !angular.isDefined(value) || value === '')) {
          return true;
        }

        //Check match
        return value >= match;
      };
    }
  };
});
