
/**
 * Module definition and dependencies
 */
angular.module('Common.Utility.GeoLocation.Service', [])

/**
 * Service definition
 */
.factory('GeoLocation', function($q) {

	/**
	 * Service class
	 */
	var GeoLocation = {

		/**
		 * Get position
		 */
		getPosition: function() {

			//Check if available
			if (!navigator.geolocation) {
				return null;
			}

			//Create deferred
			var deferred = $q.defer();

			//Geolocate
			navigator.geolocation.getCurrentPosition(function(position) {
				deferred.resolve(position);
			}, function(error) {
				deferred.reject(error.code);
			});

			//Return promise
			return deferred.promise;
		}
	};

	//Return
	return GeoLocation;
});