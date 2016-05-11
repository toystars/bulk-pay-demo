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

  }


  return new BusinessDataService();

}]);