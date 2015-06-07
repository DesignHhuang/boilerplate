
/**
 * Module definition and dependencies
 */
angular.module('Common.Utility.Url.Service', [
	'Common.Filters.String.Snakecase.Filter'
])

/**
 * Factory definition
 */
.factory('Url', function($window, $filter) {

	/**
	 * Tries to decode an URI component without throwing an exception
	 */
	function tryDecodeURIComponent(v) {
		try {
			return decodeURIComponent(v);
		} catch (e) {}
	}

	/**
	 * Tries to encode an URI component without throwing an exception
	 */
	function tryEncodeURIComponent(v, pctEncodeSpaces) {
		try {
			return encodeURIComponent(v).
				replace(/%40/gi, '@').
				replace(/%3A/gi, ':').
				replace(/%24/g, '$').
				replace(/%2C/gi, ',').
				replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
		} catch (e) {}
	}

	/**
	 * Service object
	 */
	var Url = {

		/**
		 * Base 64 decode URL string
		 */
		base64Decode: function(s) {
		  var o = s.replace('-', '+').replace('_', '/');
			switch (o.length % 4) {
				case 0:
					break;
				case 2:
					o += '==';
					break;
				case 3:
					o += '=';
					break;
				default:
					throw 'Illegal base64 url string';
			}
		  	return tryDecodeURIComponent(escape($window.atob(o)));
		},

		/**
		 * Parses an escaped url query string into key-value pairs
		 */
		fromQueryString: function(s) {
			var obj = {}, kv, key;
			angular.forEach((s || "").split('&'), function(s) {
				if (s) {
					kv = s.replace(/\+/g,'%20').split('=');
					key = tryDecodeURIComponent(kv[0]);
					if (angular.isDefined(key)) {
						var val = angular.isDefined(kv[1]) ? tryDecodeURIComponent(kv[1]) : true;
						if (!hasOwnProperty.call(obj, key)) {
							obj[key] = val;
						} else if (isArray(obj[key])) {
							obj[key].push(val);
						} else {
							obj[key] = [obj[key],val];
						}
					}
				}
			});
			return obj;
		},

		/**
		 * Convert key-value pairs object to a parametrized query string
		 */
		toQueryString: function(obj, toSnakeCase) {

			//No obj?
			if (!obj || !angular.isObject(obj)) {
				return '';
			}

			//Initialize parts array
			var parts = [];

			//Loop the parameters
			angular.forEach(obj, function(value, key) {

				//Skip null/undefined values
				if (value === null || angular.isUndefined(value)) {
					return;
				}

				//Convert to array
				if (!angular.isArray(value)) {
					value = [value];
				}

				//Loop values
				angular.forEach(value, function(v) {

					//Handle objects
					if (angular.isObject(v)) {
						if (angular.isDate(v)) {
							v = v.toISOString();
						}
						else {
							v = angular.toJson(v);
						}
					}

					//Snake case keys?
					if (toSnakeCase) {
						key = $filter('snakecase')(key);
					}

					//Push to parts
					parts.push(tryEncodeURIComponent(key) + '=' + tryEncodeURIComponent(v));
				});

			});

			//Any parts?
			if (parts.length > 0) {
				return parts.join('&');
			}

			//No parts
			return '';
		}
	};

	//Return
	return Url;
});
