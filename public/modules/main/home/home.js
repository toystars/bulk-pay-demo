
bulkPay.controller('HomeCtrl', ['$scope', '$rootScope', 'AuthSvc', 'toastr', '$cookies', '$state', 'OrgSvc', function ($scope, $rootScope, AuthSvc, toastr, $cookies, $state, OrgSvc) {

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