bulkPay.factory('PayTypesSvc', ['$http', '$cookies', function($http, $cookies){

  function PayTypesService () {

    var self = this;

    self.getAllTypes = function () {
      var req = {
        method: 'GET',
        url: '/api/pay/types'
      };
      return $http(req);
    };

    self.getCompanyPayTypes = function (companyId) {
      var req = {
        method: 'GET',
        url: '/api/company/types/' + companyId
      };
      return $http(req);
    };

    self.createType = function (dataObject) {
      var req = {
        method: 'POST',
        url: '/api/pay/types',
        data: dataObject
      };
      return $http(req);
    };

    self.updateType = function (dataObject) {
      var req = {
        method: 'PUT',
        url: '/api/pay/types/' + dataObject._id,
        data: dataObject
      };
      return $http(req);
    };

    self.deleteType = function (typeId) {
      var req = {
        method: 'DELETE',
        url: '/api/pay/types/' + typeId
      };
      return $http(req);
    };

  }

  return new PayTypesService();

}]);