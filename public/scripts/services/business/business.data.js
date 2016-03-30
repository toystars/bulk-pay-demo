bulkPay.factory('BusinessDataSvc', ['$http', '$cookies', '$state', 'Business', 'toastr', '$stateParams', '$rootScope', function ($http, $cookies, $state, Business, toastr, $stateParams, $rootScope) {

  function BusinessDataService() {

    var businessId = '';
    var currentBusiness = {};
    var routeScope = {};

    var safeCb = function (cb) {
      return (angular.isFunction(cb)) ? cb : angular.noop;
    };

    var getCurrentBusiness = function () {
      Business.get(businessId).success(function (business) {
        if (business) {
          currentBusiness = business;
          $rootScope.$broadcast('business.fetched', business);
          getBusinessHistory();
        }
      }).error(function (error) {
        toastr.error('Invalid Business Id');
        $cookies.remove('currentBusiness');
        $state.go('home.overview');
      });
    };

    var getBusinessHistory = function () {
      Business.getBusinessHistory(currentBusiness._id).success(function (history) {
        $rootScope.$broadcast('history.fetched', history);
      }).error(function (error) {
        console.log(error);
      })
    };

    var self = this;


    /*
    * Set businessId from overview route
    * */
    self.setBusinessId = function () {
      businessId = $cookies.get('currentBusiness');
      getCurrentBusiness();
    };


    /*
    * Get businessId from service
    * */
    self.getBusinessId = function () {
      return businessId;
    };


    /*
    * Get business
    * */
    self.getBusiness = function () {
      return currentBusiness;
    };


    /*
    * Set local scope object for business object sync
    * */
    self.setLocalScope = function () {
      getCurrentBusiness();
    };


    /*
    * Refresh business object
    * */
    self.refreshBusiness = function () {
      getCurrentBusiness();
    };


    /*if ($cookies.get('token')) {
     getCurrentUser();
     }

     var self = this;

     /!**
     * Check if a user is logged in
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callBack - optional, function(is)
     * @return {Boolean|Function}
     *!/
     self.isLoggedIn = function (callBack) {
     if (arguments.length === 0) {
     return currentUser.hasOwnProperty('role');
     }
     safeCb(callBack)(currentUser.hasOwnProperty('role'));
     };


     /!**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function}   callBack     - call back
     * @return {user}
     *!/
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


     /!**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callBack - optional, function(error, user)
     * @return {Promise}
     *!/
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


     /!*
     * Refresh user object after update to dependent documents
     * *!/
     self.refreshUser = function () {
     getCurrentUser();
     };


     /!**
     * Gets all available info on a user
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, function(user)
     * @return {Object|Promise}
     *!/
     self.getCurrentUser = function (callback) {
     if (arguments.length === 0) {
     return currentUser;
     }
     safeCb(callback)(currentUser);
     };


     /!**
     * Delete access token and user info
     *!/
     self.logout = function () {
     $cookies.remove('token');
     currentUser = {};
     $state.go('login');
     };







     /!*
     * Business management logic
     * *!/

     /!*
     * Get businesses count
     * *!/
     self.getBusinessesCount = function () {
     return currentUser.businesses.length;
     };

     /!*
     * Get all businesses
     * *!/
     self.getBusinesses = function () {
     return currentUser.businesses;
     };*/

  }


  return new BusinessDataService();

}]);