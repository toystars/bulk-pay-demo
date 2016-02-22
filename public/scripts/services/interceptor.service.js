bulkPay.factory('authInterceptor', ['$rootScope', '$q', '$cookies', '$injector', function($rootScope, $q, $cookies, $injector){
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($cookies.get('token')) {
        config.headers.token = $cookies.get('token');
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
}]);
