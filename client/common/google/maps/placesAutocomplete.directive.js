
/**
 * See: https://developers.google.com/maps/documentation/javascript/places-autocomplete
 *      https://github.com/kuhnza/angular-google-places-autocomplete/blob/master/src/autocomplete.js
 */

/**
 * Module definition and dependencies
 */
angular.module('Common.Google.Maps.PlacesAutocomplete.Directive', [
	'Common.Google.Service'
])

/**
 * Directive
 */
.directive('placesAutocomplete', ['Google', function(google) {

	/**
	 * Helper to find an address component type
	 */
	var findAddressComponentOfType = function(place, type, format) {
		format = format || 'long_name';
		for (var c = 0; c < place.address_components.length; c++) {
			if (place.address_components[c].types.indexOf(type) !== -1) {
				return place.address_components[c][format];
			}
		}
		return '';
	};

	/**
	 * Helper to determine spread of a place, (e.g. for inaccurate addresses, like a suburb or city)
	 */
	var determineSpread = function(place) {

		//Validate viewport data
		if (!place.geometry.viewport) {
			return 0;
		}

		//Get distance and return rounded to meters
		var distance = google.maps.geometry.spherical.computeDistanceBetween(place.geometry.viewport.getNorthEast(), place.geometry.viewport.getSouthWest());
		return Math.round(distance * 1000) / 1000;
	};

	/**
	 * Directive
	 */
	return {
		restrict: 'A',
		scope: {
			place: '=placeModel',
			address: '=addressModel',
			geoLocation: '=geoLocation'
		},
		link: function(scope, element, attrs) {

			//Autocomplete options
			var options = {};

			//Restrict by types?
			if (attrs.restrictTypes) {
				options.types = attrs.restrictTypes.split(',');
			}

			//Restrict by country?
			if (attrs.restrictCountry) {
				options.componentRestrictions = options.componentRestrictions || {};
				options.componentRestrictions.country = attrs.restrictCountry;
			}

			//Initialize autocomplete API now with options
			var autocomplete = new google.maps.places.Autocomplete(element[0], options);

			//Set bounds if geo location given
			if (scope.geoLocation && angular.isObject(scope.geoLocation) && scope.geoLocation.coords) {
				var circle = new google.maps.Circle({
					center: new google.maps.LatLng(scope.geoLocation.coords.latitude, scope.geoLocation.coords.longitude),
					radius: scope.geoLocation.coords.accuracy
				});
				autocomplete.setBounds(circle.getBounds());
			}

			/**
			 * Event listener for place changes
			 */
			var autocompleteListener = google.maps.event.addListener(autocomplete, 'place_changed', function() {

				//Get selected place
				var place = autocomplete.getPlace();

				//Set in scope
				scope.$apply(function() {

					//Set entire place in scope model
					scope.place = place;

					//Set specific filtered address details in scope
					scope.address = scope.address || {};
					scope.address.selected = true;
					scope.address.enteredValue = element[0].value;
					scope.address.spread = determineSpread(place);
					scope.address.latitude = Math.round(place.geometry.location.lat() * 10000000) / 10000000;
					scope.address.longitude = Math.round(place.geometry.location.lng() * 10000000) / 10000000;
					scope.address.vicinity = place.vicinity;
					scope.address.streetNumber = findAddressComponentOfType(place, 'street_number');
					scope.address.streetName = findAddressComponentOfType(place, 'route');
					scope.address.city = findAddressComponentOfType(place, 'locality');
					scope.address.postalCode = findAddressComponentOfType(place, 'postal_code');
				});
			});

			/**
			 * Event listener for scope destruction
			 */
			scope.$on('$destroy', function(event) {
				google.maps.event.removeListener(autocompleteListener);
				google.maps.event.clearInstanceListeners(autocomplete);
				var containers = document.getElementsByClassName('pac-container');
				for (var i = 0; i < containers.length; i++) {
					containers[i].parentNode.removeChild(containers[i]);
				}
			});
		}
	};
}]);