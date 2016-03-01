bulkPay.factory('AuthSvc', ['$http', '$cookies', '$state', 'User', 'toastr', function ($http, $cookies, $state, User, toastr) {

  function AuthService() {

    var currentUser = {};
    var safeCb = function (cb) {
      return (angular.isFunction(cb)) ? cb : angular.noop;
    };

    var getCurrentUser = function () {
      User.get().success(function (user) {
        currentUser = user;
      }).error(function (error) {
        toastr.error(error.message);
        $cookies.remove('token');
      });
    };

    if ($cookies.get('token')) {
      getCurrentUser();
    }

    var self = this;

    /**
     * Check if a user is logged in
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callBack - optional, function(is)
     * @return {Boolean|Function}
     */
    self.isLoggedIn = function (callBack) {
      if (arguments.length === 0) {
        return currentUser.hasOwnProperty('role');
      }
      safeCb(callBack)(currentUser.hasOwnProperty('role'));
    };


    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function}   callBack     - call back
     * @return {user}
     */
    self.createUser = function (user, callBack) {
      return User.create(user).success(function (data) {
        $cookies.put('token', data.token);
        User.get().success(function (user) {
          currentUser = user;
          safeCb(callBack)(null, data);
        }).error(function (error) {
          console.log('Error: ', error);
        });
      }).error(function (error) {
        safeCb(callBack)(error, null);
      });
    };


    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callBack - optional, function(error, user)
     * @return {Promise}
     */
    self.login = function (user, callBack) {
      $http.post('/api/users/signin', user).success(function (data) {
        $cookies.put('token', data.token);
        User.get().success(function (user) {
          currentUser = user;
          safeCb(callBack)(true, null);
        }).error(function (error) {
          console.log('Error: ', error);
        });
      }).error(function (error) {
        safeCb(callBack)(null, error);
      });
    };


    /*
    * Refresh user object after update to dependent documents
    * */
    self.refreshUser = function () {
      getCurrentUser();
    };


    /**
     * Gets all available info on a user
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, function(user)
     * @return {Object|Promise}
     */
    self.getCurrentUser = function (callback) {
      if (arguments.length === 0) {
        return currentUser;
      }
      safeCb(callback)(currentUser);
    };


    /**
     * Delete access token and user info
     */
    self.logout = function () {
      $cookies.remove('token');
      currentUser = {};
      $state.go('login');
    };



    /*
    * Business management logic
    * */

    /*
    * Get businesses count
    * */
    self.getBusinessesCount = function () {
      return currentUser.businesses.length;
    };

    /*
    * Get all businesses
    * */
    self.getBusinesses = function () {
      return currentUser.businesses;
    };


    /*
    * Error handling
    * */
    self.handleError = function (error) {
      if (error.message && error.message === 'Session Expired!') {
        self.logout();
      }
    };

  }


  return new AuthService();

}]);