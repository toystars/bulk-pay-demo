bulkPay.controller('BusinessNewPayRunCtrl', ['$scope', '$rootScope', '$timeout', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, $timeout, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

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

  $scope.$parent.inView = 'New Pay Run';
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
    getPaymentEmployees(businessId);
  });

  var getPaymentEmployees = function (businessId) {
    $http.get('/api/employees/business/' + businessId + '/payrun').success(function (employees) {
      console.log(employees);
      $scope.employees = employees;
      $scope.dataFetched = true;
    }).error(function (error) {
      AuthSvc.handleError(error);
    })
  };


}]);

