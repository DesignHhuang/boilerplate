
/**
 * Module definition and dependencies
 */
angular.module('App.User.UserExists.Directive', [
  'App.User.Model'
])

/**
 * Directive
 */
.directive('userExists', function(UserModel, $q, $cacheFactory) {
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

      //Add asynchronous validator
      ngModel.$asyncValidators.exists = function(modelValue, viewValue) {

        //Create deferred
        var deferred = $q.defer();

        //Get value to check
        var value = modelValue || viewValue;

        //Check cache
        var exists = userExistsCache.get(value);
        if (exists !== undefined) {
          if (exists) {
            deferred.reject();
          }
          else {
            deferred.resolve();
          }
          return;
        }

        //Create new model with data to check
        var data = {};
        data[field] = value;

        //Check for existence
        UserModel.exists(data).then(function(exists) {

          //Store result in cache
          userExistsCache.put(value, exists);

          //Reject or resolve promise
          if (exists) {
            deferred.reject();
          }
          else {
            deferred.resolve();
          }
        });

        //Return promise
        return deferred.promise;
      };
    }
  };
});
