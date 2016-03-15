bulkPay.controller('BusinessSinglePayRunCtrl', ['$scope', '$rootScope', '$timeout', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, $timeout, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

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

  $scope.options = {
    placeholder: "Choose One",
    allowClear: true
  };
  var businessId = '';
  $scope.dataFetched = false;
  $scope.currentPage = 1;
  $scope.pageSize = 25;
  var payRunId = $stateParams.payRunId;
  $scope.payRolls = [];
  $scope.payRun = {};

  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getPayRunInfo();
    getPayRolls();
  });


  var getPayRunInfo = function () {
    $http.get('/api/payruns/' + payRunId).success(function (payRun) {
      $scope.payRun = payRun;
    }).error(function (error) {
      $state.go('business.payruns');
    })
  };

  var getPayRolls = function () {
    $http.get('/api/payrolls/payrun/' + payRunId).success(function (payRolls) {
      $scope.payRolls = payRolls;
      $scope.dataFetched = true;
    }).error(function (error) {
      AuthSvc.handleError(error);
    })
  };

  $scope.viewPaySlip = function (payRoll) {
    console.log(payRoll);
  };


}]);

