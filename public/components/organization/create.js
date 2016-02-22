
bulkPay.controller('OrgCreateCtrl', ['$scope', 'toastr', 'OrgSvc', '$cookies', '$state', 'AuthSvc', function ($scope, toastr, OrgSvc, $cookies, $state, AuthSvc) {

  AuthSvc.checkLoggedInStatus();
  if ($cookies.get('userCompany')) {
    $state.go('home.overview');
  }

  $scope.errorMessage = '';
  $scope.errorOccur = false;

  $scope.newCompany = {
    userId: '',
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
    website: ''
  };

  $scope.createOrg = function () {
    $scope.errorMessage = '';
    $scope.errorOccur = false;
    $scope.newCompany.userId = $cookies.get('userId');
    OrgSvc.createCompany($scope.newCompany).success(function (data) {
      if (!data.message) {
        // show toast
        toastr.success('Company created successfully.');
        // save data in cookie and redirect to dash...
        $cookies.put('userCompany', JSON.stringify(data));
        $state.go('home.overview');
      }
      $scope.errorOccur = true;
      $scope.errorMessage = (data.message) ? data.message : 'Internal server error!';
    }).error(function (error) {
      console.log(error);
      $scope.errorOccur = true;
      $scope.errorMessage = (error.message) ? error.message : 'Internal server error!';
    });
  };

  $scope.validate = function () {
    return (!$scope.newCompany.name || $scope.newCompany.name === '') || (!$scope.newCompany.address || $scope.newCompany.address === '') ||
          (!$scope.newCompany.country || $scope.newCompany.country === '') || (!$scope.newCompany.email || $scope.newCompany.email === '');
  };

}]);








