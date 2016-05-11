
bulkPay.controller('HomeCtrl', ['$scope', '$rootScope', '$http', 'AuthSvc', 'toastr', '$cookies', '$state', 'OrgSvc', function ($scope, $rootScope, $http, AuthSvc, toastr, $cookies, $state, OrgSvc) {
  

  AuthSvc.getCurrentUser(function (user) {
    $scope.user = user;
  });


  if ($cookies.get('selfBusinessId') && $cookies.get('selfEmployeeId')) {

    $http.get('/api/businesses/' + $cookies.get('selfBusinessId')).success(function (business) {
      $scope.business = business;
    }).error(function (error) {
      console.log(error);
    });
    $http.get('/api/employees/' + $cookies.get('selfEmployeeId')).success(function (employee) {
      $scope.employee = employee;
    }).error(function (error) {
      console.log(error);
    });

  }
  


  $scope.inView = 'DashBoard';
  $scope.toggleActive = function (navName) {
    $scope.inView = navName;
  };


  $scope.signOut = function () {
    AuthSvc.logout();
  };

}]);