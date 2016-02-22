
bulkPay.controller('signUpCtrl', ['$scope', 'toastr', '$state', 'AuthSvc', function ($scope, toastr, $state, AuthSvc) {

  AuthSvc.isLoggedIn(function (status) {
    if (status) {
      $state.go('home.overview');
    }
  });

  $scope.errorMessage = '';
  $scope.errorOccur = false;
  $scope.user = {};


  $scope.register = function () {

    AuthSvc.createUser($scope.user, function (error, data) {
      if (data) {
        toastr.success('Sign up Successful');
        $state.go('home.overview');
      }
    });

  };


}]);