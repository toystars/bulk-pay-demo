
bulkPay.controller('BusinessOverviewCtrl', ['$scope', '$state', 'AuthSvc', '$stateParams', 'BusinessDataSvc', '$cookies', function ($scope, $state, AuthSvc, $stateParams, BusinessDataSvc, $cookies) {


  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.$parent.inView = 'DashBoard';

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId($scope);
  } else {
    BusinessDataSvc.setLocalScope($scope);
  }



}]);