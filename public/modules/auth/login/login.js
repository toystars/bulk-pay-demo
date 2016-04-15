
bulkPay.controller('loginCtrl', ['$scope', 'AuthSvc', 'toastr', '$cookies', '$state', 'OrgSvc', function ($scope, AuthSvc, toastr, $cookies, $state, OrgSvc) {

  if (AuthSvc.isLoggedIn()) {
    $state.go('home.overview');
  }

  $scope.user = {};
  $scope.errorMessage = '';
  $scope.errorOccur = false;
  $scope.loginLoader = '';

  // signIn function
  $scope.signIn = function () {
    clearError();
    $scope.loginLoader = 'images/loaders/loader19.gif';

    AuthSvc.login($scope.user, function (status, error) {
      if (status) {
        AuthSvc.getCurrentUser(function (user) {
          toastr.success('Login Successful');
          if (user.role === 'superAdmin') {
            $state.go('home.overview');
          }
        });
      }
      if (error) {
        $scope.loginLoader = '';
        $scope.errorOccur = true;
        $scope.errorMessage = error.message;
      }
    });
  };

  var clearError = function () {
    $scope.errorOccur = false;
    $scope.errorMessage = '';
  };


}]);