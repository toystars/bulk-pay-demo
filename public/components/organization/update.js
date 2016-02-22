
bulkPay.controller('OrgUpdateCtrl', ['$scope', 'toastr', 'OrgSvc', '$cookies', '$state', 'AuthSvc', function ($scope, toastr, OrgSvc, $cookies, $state, AuthSvc) {

  AuthSvc.checkLoggedInStatus();
  OrgSvc.checkOrgStatus();

  $scope.errorMessage = '';
  $scope.errorOccur = false;
  $scope.oldCompany = { };

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

  var getUserCompany = function () {
    OrgSvc.getUserCompany($cookies.get('userId')).success(function (company) {
      $scope.newCompany = company;
      angular.copy($scope.newCompany, $scope.oldCompany);
    }).error(function (error) {
      console.log(error);
    });
  };

  getUserCompany();

  var companyChanged = function () {
    var keys = Object.keys($scope.oldCompany);
    for (var x = 0; x < keys.length; x++) {
      if ($scope.oldCompany.hasOwnProperty(keys[x])) {
        if ($scope.oldCompany[keys[x]] !== $scope.newCompany[keys[x]]) {
          return true;
        }
      }
    }
    return false;
  };

  $scope.updateOrg = function () {
    $scope.errorMessage = '';
    $scope.errorOccur = false;
    $scope.newCompany.userId = $cookies.get('userId');
    OrgSvc.updateCompany($scope.newCompany).success(function (data) {
      if (!data.message) {
        toastr.success('Company updated successfully.');
        $cookies.put('userCompany', JSON.stringify(data));
        getUserCompany();
      } else {
        $scope.errorOccur = true;
        $scope.errorMessage = (data.message) ? data.message : 'Internal server error!';
      }
    }).error(function (error) {
      console.log(error);
      $scope.errorOccur = true;
      $scope.errorMessage = (error.message) ? error.message : 'Internal server error!';
    });
  };

  $scope.validate = function () {
    return !companyChanged() || (!$scope.newCompany.name || $scope.newCompany.name === '') || (!$scope.newCompany.address || $scope.newCompany.address === '') ||
      (!$scope.newCompany.country || $scope.newCompany.country === '') || (!$scope.newCompany.email || $scope.newCompany.email === '');
  };

  $scope.cancel = function () {
    if (companyChanged()) {
      var choice = confirm('Company inf has changed. Are you sure you cant to cancel?');
      if (choice) {
        $state.go('home.overview');
      }
    } else {
      $state.go('home.overview');
    }
  };

}]);








