bulkPay.controller('BusinessPayRunsManagerCtrl', ['$scope', '$rootScope', '$timeout', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, $timeout, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  $scope.$parent.inView = 'Manage Pay Runs';
  $scope.options = {
    placeholder: "Choose One",
    allowClear: true
  };
  var businessId = '';
  $scope.dataFetched = false;

  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getPayRuns();
  });


  var getPayRuns = function () {
    $http.get('/api/payruns/business/' + businessId).success(function (payRuns) {
      $scope.payRuns = payRuns;
      $scope.dataFetched = true;
    }).error(function (error) {
      AuthSvc.handleError(error);
    })
  };


}]);

