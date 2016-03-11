bulkPay.controller('BusinessSingleEmployeeCtrl', ['$scope', '$rootScope', '$timeout', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, $timeout, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

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
  $scope.inView = 'Profile Info';
  var businessId = '';
  var employeeId = $stateParams.employeeId;
  $scope.dataFetched = false;

  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getEmployee();
  });

  $scope.changeView = function (view) {
    $scope.inView = view;
  };

  var getEmployee = function () {
    $http.get('/api/employees/' + employeeId).success(function (employee) {
      $scope.employee = employee;
      getSingleEmployeeInfo(employeeId);
    })
  };

  var getSingleEmployeeInfo = function (employeeId) {
    $http.get('/api/positions/employee/' + employeeId).success(function (data) {
      $scope.employee = data.oldEmployee;
      $scope.employee.positionName = data.newEmployee.positionName;
      $scope.employee.businessUnitName = data.newEmployee.businessUnitName;
      $scope.employee.divisionName = data.newEmployee.divisionName;
      $scope.employee.departmentName = data.newEmployee.departmentName;
      $scope.employee.payGroupName = data.newEmployee.payGroupName;
      $scope.employee.payGradeName = data.newEmployee.payGradeName;
      $scope.employee.supervisor = data.newEmployee.supervisor;
      $scope.dataFetched = true;
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };

}]);

