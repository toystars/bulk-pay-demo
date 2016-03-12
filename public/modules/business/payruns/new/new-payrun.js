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
  $scope.payGroups = [{
    name: 'All',
    _id: 'all'
  }];
  $scope.payGroupId = 'all';
  $scope.currentPage = 1;
  $scope.pageSize = 25;
  $scope.filteredEmployees = [];
  $scope.singleEmploye = {};


  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getPaymentEmployees(businessId);
  });

  var getPaymentEmployees = function (businessId) {
    $http.get('/api/employees/business/' + businessId + '/payrun').success(function (data) {
      console.log(data);
      $scope.payGroups = $scope.payGroups.concat(data.payGroups);
      $scope.employees = data.employees;
      _.each($scope.employees, function (employee) {
        employee.paymentInformation = new PayRollCalculation(employee, employee.payGrade.payTypes, employee.taxRule, employee.pensionRule).calculate();
      });
      $scope.filteredEmployees = $scope.employees;
      $scope.dataFetched = true;
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };

  $scope.changeGroup = function (payGroupId) {
    var employees = [];
    if (payGroupId === 'all') {
      $scope.filteredEmployees = $scope.employees;
    } else {
      _.each($scope.employees, function (employee) {
        if (employee.payGroupId === payGroupId) {
          employees.push(employee);
        }
      });
      $scope.filteredEmployees = employees;
    }
    return $scope.filteredEmployees;
  };

  $scope.showPayDetails = function (employee) {
    $scope.singleEmployee = employee;
  };

  $scope.getNonDeductions = function () {
    return $scope.singleEmployee.paymentInformation.payBreakDown.wages.concat($scope.singleEmployee.paymentInformation.payBreakDown.benefits);
  };

  $scope.resetSummary = function () {
    $scope.singleEmployee = {};
  };

}]);

