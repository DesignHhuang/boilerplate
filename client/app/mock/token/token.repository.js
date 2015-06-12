
/**
 * Module definition and dependencies
 */
angular.module('App.Mock.Token.Repository.Service', [])

/**
 * Service definition
 */
.factory('TokenRepository', function(
	$window, Url, MockRepository, UserRepository
) {

	/**
	 * Default items
	 */
	var defaultItems = [];

	/**
	 * Helper to encode token data
	 */
	var encodeTokenData = function(data) {
		var encoded = $window.btoa(angular.toJson(data));
		return encoded.replace(/=+$/, '');
	};

	/**
	 * Decode token payload
	 */
	var decodeTokenPayload = function(token) {

		//Split in parts
		var parts = token.split('.');
		if (parts.length !== 3) {
			return null;
		}

		//Get decoded payload
		try {
			var decoded = Url.base64Decode(parts[1]);
			return angular.fromJson(decoded);
		}
		catch (e) {
			return null;
		}
	};

	/**
	 * Mock repository extension
	 */
	var TokenRepository = angular.extend({}, MockRepository, {

		/**
		 * Find item by access token
		 */
		findByAccessToken: function(accessToken) {
			return this.findByProperty('accessToken', accessToken);
		},

		/**
		 * Find item by refresh token
		 */
		findByRefreshToken: function(refreshToken) {
			return this.findByProperty('refreshToken', refreshToken);
		},

		/**
		 * Generate a new token
		 */
		generateToken: function(user) {

			//Validate user
			if (!angular.isObject(user) || !user.id) {
				return false;
			}

			//Create token header
			var header = encodeTokenData({
				alg: 'HS256',
				typ: 'JWT'
			});

			//Create token payload
			var payload = encodeTokenData({
				id: user.id,
				roles: user.isAdmin ? ['admin'] : ['user']
			});

			//Generate token item
			var token = {
				id: this.autoIncrementId(),
				userId: user.id,
				accessToken: header + '.' + payload + ".HUzNzy-ZSfcNHK37Ku8HN7P8P-y7CBpKTnAPJ_eEDOA"
			};

			//Store in items array
			this.items.push(token);
			this.storeItems();

			//Clone and return
			var clone = angular.copy(token);
			return clone;
		},

		/**
		 * Get authenticated user from given headers
		 */
		authUser: function(headers) {

			//Validate headers object
			if (!angular.isObject(headers) || !headers.Authorization) {
				return null;
			}

			//Validate Authorization header
			var parts = headers.Authorization.split(' ');
			if (parts.length < 2 || parts[0] !== 'Bearer' || !parts[1]) {
				return null;
			}

			//Find token match
			var item = this.findByAccessToken(parts[1]);
			if (!item || !item.userId) {
				return null;
			}

			//Get authenticated user
			var authUser = UserRepository.findById(item.userId);
			if (!authUser) {
				return null;
			}

			//Use site as another user? Must be admin for this
			if (angular.isDefined(headers['X-Use-Site-As']) && headers['X-Use-Site-As'] && authUser.isAdmin) {
				var spoofUser = UserRepository.findById(headers['X-Use-Site-As']);
				return spoofUser || authUser;
			}

			//Otherwise just return the auth user
			return authUser;
		}
	});

	//Initialize
	TokenRepository.init('tokens', defaultItems);

	//Return
	return TokenRepository;
});
