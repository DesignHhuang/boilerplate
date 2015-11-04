
/**
 * Module definition and dependencies
 */
angular.module('Directives.ngModel.Directive', [])

/**
 * Directive
 */
.directive('ngModel', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, element, attrs, ngModel) {

      /**
       * Has error helper function which also takes into account the field's $dirty state and
       * the forms submitted state, in addition to the field's $invalid state.
       */
      ngModel.hasError = function() {
        console.log(this);
        if (!this.$$parentForm.$submitted && !this.$dirty) {
          return false;
        }
        return this.$invalid;
      };
    }
  };
});
