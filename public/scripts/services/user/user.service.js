
bulkPay.factory('User', ['$http', '$cookies', function($http, $cookies) {

  function UserService() {
    var self = this;

    self.get = function () {
      var request = {
        method: 'GET',
        url: '/api/users/me'
      };
      return $http(request);
    };

    self.create = function (user) {
      var request = {
        method: 'POST',
        url: '/api/users/signup',
        data: user
      };
      return $http(request);
    };
  }
  return new UserService();
}]);