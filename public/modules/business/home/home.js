
bulkPay.controller('BusinessHomeCtrl', ['$scope', 'AuthSvc', '$state', function ($scope, AuthSvc, $state) {

  AuthSvc.getCurrentUser(function (user) {
    $scope.user = user;
  });


  $scope.inView = 'DashBoard';
  $scope.toggleActive = function (navName) {
    $scope.inView = navName;
  };

  $scope.signOut = function () {
    AuthSvc.logout();
  };

}]);