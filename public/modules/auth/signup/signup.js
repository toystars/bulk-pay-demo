
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
    clearError();
    $scope.loginLoader = 'images/loaders/loader19.gif';
    AuthSvc.createUser($scope.user, function (error) {
      if (error) {
        $scope.loginLoader = '';
        $scope.errorOccur = true;
        $scope.errorMessage = error.message;
      } else {
        AuthSvc.getCurrentUser(function (user) {
          toastr.success('Sign up Successful');
          if (user.role === 'superAdmin') {
            $state.go('home.overview');
          }
        });
      }
    });
  };

  var clearError = function () {
    $scope.errorOccur = false;
    $scope.errorMessage = '';
  };


}]);