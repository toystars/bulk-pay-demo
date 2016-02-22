bulkPay.factory('OrgSvc', ['$http', '$cookies', '$state', function ($http, $cookies, $state){

  function OrgService() {

    var self = this;

    self.checkOrgStatus = function () {
      if (!$cookies.get('userCompany')) {
        $state.go('home.neworg');
      }
    };

    self.createCompany = function (company) {
      var req = {
        method: 'POST',
        url: '/api/org',
        data: company
      };
      return $http(req);
    };

    self.getUserCompany = function (userId) {
      var req = {
        method: 'GET',
        url: '/api/user/org/' + userId
      };
      return $http(req);
    };

    self.updateCompany = function (company) {
      var req = {
        method: 'PUT',
        url: '/api/org/' + company._id,
        data: company
      };
      return $http(req);
    };

  }

  return new OrgService();

}]);