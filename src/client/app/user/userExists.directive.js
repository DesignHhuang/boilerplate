
/**
 * Module definition and dependencies
 */
angular.module('App.User.UserExists.Directive', [
  'App.User.Model'
])

/**
 * Directive
 */
.directive('userExists', function(User, $q, $cacheFactory, $timeout) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {

      //Field to check
      var field = attrs.name;

      //Get or create cache for this field
      var userExistsCache = $cacheFactory.get('userExists.' + field);
      if (!userExistsCache) {
        userExistsCache = $cacheFactory('userExists.' + field);
      }

      //Pending validation
      var pendingValidation = null;

      //Add asynchronous validator
      ngModel.$asyncValidators.exists = function(modelValue, viewValue) {

        //Cancel pending validation
        if (pendingValidation) {
          $timeout.cancel(pendingValidation);
        }

        //Helper to get the validation promise
        function getValidationPromise() {

          //Get value to check
          var value = modelValue || viewValue;

          //Check cache
          var exists = userExistsCache.get(value);
          if (exists !== undefined) {
            if (exists) {
              return $q.reject();
            }
            else {
              return $q.when();
            }
            return;
          }

          //Create new model with data to check
          var data = {};
          data[field] = value;

          //Check for existence
          return User.exists(data).then(function(exists) {
            userExistsCache.put(value, exists);
            if (exists) {
              return $q.reject();
            }
            else {
              return $q.when();
            }
          });
        }

        //Create pending validation promise
        pendingValidation = $timeout(function() {
          pendingValidation = null;
          return getValidationPromise();
        }, 500);

        //Return it
        return pendingValidation;
      };
    }
  };
});
