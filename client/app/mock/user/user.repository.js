
/**
 * Module definition and dependencies
 */
angular.module('App.Mock.User.Repository.Service', [])

/**
 * Service definition
 */
.factory('UserRepository', function(
	MockRepository
) {

	/**
	 * Default items
	 */
	var defaultItems = [
		{
			id: 1,
			name: "Test user",
			email: "test@example.com",
			isActive: 1,
			isEmailVerified: true,
			isExternal: false,
			externalProvider: '',
			externalId: ''
		}
	];

	/**
	 * Mock repository extension
	 */
	var UserRepository = angular.extend({}, MockRepository, {

		/**
		 * Get the authenticated user ID
		 */
		getAuthenticatedId: function() {
			return this.authenticatedId;
		},

		/**
		 * Manually set the authenticated user ID
		 */
		setAuthenticatedId: function(id) {
			this.toStorage('authId', this.authenticatedId = id);
		},

		/**
		 * Get the authenticated user
		 */
		getAuthenticatedUser: function(asReference) {

			//Not authenticated?
			if (!this.isAuthenticated()) {
				return {};
			}

			//Find authenticated user
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].id === this.authenticatedId) {
					if (asReference) {
						return this.items[i];
					}
					var user = angular.copy(this.items[i]);
					return this.withData(user);
				}
			}

			//No match
			return {};
		},

		/**
		 * Auth check
		 */
		isAuthenticated: function() {
			return this.authenticatedId !== 0;
		},

		/**
		 * Do a login
		 */
		login: function(credentials) {

			//Validate data
			if (!angular.isObject(credentials) || credentials.email === '' || credentials.password === '') {
				return false;
			}

			//Match against items (only email)
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].email === credentials.email) {
					this.setAuthenticatedId(this.items[i].id);
					return true;
				}
			}

			//No match
			return false;
		},

		/**
		 * Logout
		 */
		logout: function() {
			this.setAuthenticatedId(0);
		},

		/**
		 * Query items
		 */
		query: function(params) {
			var items = this.getFilteredList(params);
			return items;
		},

		/**
		 * Check if an item exists by ID
		 */
		existsById: function(id) {
			return this.existsByProperty('id', id);
		},

		/**
		 * Find a specfic item matched by ID
		 */
		findById: function(id) {
			return this.findByProperty('id', id) || {};
		},

		/**
		 * Find a user by e-mail
		 */
		findByEmail: function(email) {
			return this.findByProperty('email', email);
		},

		/**
		 * Find by external provider/ID combo
		 */
		findByProvider: function(externalProvider, externalId) {
			return this.findByParams({
				externalProvider: externalProvider,
				externalId: externalId
			});
		},

		/**
		 * Find a user by credentials
		 */
		findByCredentials: function(credentials) {

			//Validate data
			if (!angular.isObject(credentials) || !credentials.email || !credentials.password) {
				return null;
			}

			//Find by property
			return this.findByProperty('email', credentials.email);
		},

		/**
		 * New user registration
		 */
		create: function(item) {

			//Validate params
			if (!angular.isObject(item) || !item.email || !item.name) {
				return false;
			}

			//Must have either password or external provider data
			if (!item.password && (!item.externalId || !item.externalProvider)) {
				return false;
			}

			//Make sure e-mail address doesn't exist
			if (this.existsByParams({email: item.email})) {
				return false;
			}

			//Make sure external ID doesn't exist
			if (item.externalId && item.externalProvider && this.existsByParams({
				externalProvider: item.externalProvider,
				externalId: item.externalId
			})) {
				return false;
			}

			//Append ID and make active
			item.id = this.autoIncrementId();
			item.isActive = true;

			//External?
			if (item.externalId && item.externalProvider) {
				item.isExternal = true;
				item.isEmailVerified = true;
			}
			else {
				item.isExternal = false;
				item.isEmailVerified = false;
				item.externalProvider = '';
				item.externalId = '';
			}

			//Store in items array
			this.items.push(item);
			this.storeItems();

			//Return clone
			var clone = angular.copy(item);
			return this.withData(clone);
		},

		/**
		 * Update an item
		 */
		updateById: function(id, item) {

			//Find matching item (by reference)
			var match = this.findByProperty('id', id, true) || null;
			if (!match) {
				return {};
			}

			//Extend data
			angular.extend(match, item);
			this.storeItems();

			//Clone, and return with data
			var clone = angular.copy(match);
			return this.withData(clone);
		},

		/**
		 * Verify e-mail addreses verification token
		 */
		verifyEmailToken: function(token) {
			return (token.length > 5);
		},

		/**
		 * Helper to add user data
		 */
		withData: function(user) {
			return user;
		}
	});

	//Get authenticated ID
	UserRepository.authenticatedId = parseInt(MockRepository.fromStorage('authId', 0)) || 0;

	//Initialize
	UserRepository.init('users', defaultItems);

	//Return
	return UserRepository;
});
