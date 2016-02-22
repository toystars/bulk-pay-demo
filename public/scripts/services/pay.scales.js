bulkPay.factory('PayScalesSvc', ['$http', '$cookies', function($http, $cookies){

  function PayScalesService () {

    var self = this;

    self.getAllPayScales = function () {
      var req = {
        method: 'GET',
        url: '/api/pay/scales'
      };
      return $http(req);
    };

    self.getCompanyPayScales = function (companyId) {
      var req = {
        method: 'GET',
        url: '/api/company/scales/' + companyId
      };
      return $http(req);
    };

    self.createPayScale = function (dataObject) {
      var req = {
        method: 'POST',
        url: '/api/pay/scales',
        data: dataObject
      };
      return $http(req);
    };

    self.updatePayScale = function (dataObject) {
      var req = {
        method: 'PUT',
        url: '/api/pay/scales/' + dataObject._id,
        data: dataObject
      };
      return $http(req);
    };

    self.deletePayScale = function (typeId) {
      var req = {
        method: 'DELETE',
        url: '/api/pay/scales/' + typeId
      };
      return $http(req);
    };

  }

  return new PayScalesService();

}]);