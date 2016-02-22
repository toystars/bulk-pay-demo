
bulkPay.factory('Business', ['$http', function($http) {

  function BusinessService() {
    var self = this;

    self.get = function (businessId) {
      var request = {
        method: 'GET',
        url: '/api/businesses/' + businessId
      };
      return $http(request);
    };

    self.update = function (business) {
      var request = {
        method: 'PUT',
        url: '/api/businesses/' + business._id,
        data: business
      };
      return $http(request);
    };

    self.getBusinessHistory = function (businessId) {
      var request = {
        method: 'GET',
        url: '/api/histories/object/' + businessId
      };
      return $http(request);
    };
  }
  return new BusinessService();
}]);