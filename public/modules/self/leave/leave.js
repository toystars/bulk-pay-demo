bulkPay.controller('EmployeeSelfLeaveCtrl', ['$scope', 'toastr', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, toastr, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.dataFetched = false;
  $scope.newLeave = {};
  $scope.leaves = [];

  var businessId = $cookies.get('selfBusinessId');
  var employeeId = $cookies.get('selfEmployeeId');

  var resetNewLeave = function () {
    $scope.newLeave = {};
  };

  resetNewLeave();

  $http.get('/api/leave/employee/' + employeeId).success(function (expenses) {
    $scope.leaves = expenses;
    $scope.dataFetched = true;
  }).error(function (error) {
    console.log(error);
    AuthSvc.handleError(error);
  });


  $scope.$parent.inView = 'Leave Requests';
  $scope.options = {
    placeholder: "Choose One",
    allowClear: true
  };


  $scope.createExpense = function () {
    $scope.newExpense.employeeId = employeeId;
    $scope.newExpense.businessId = businessId;
    $http.post('/api/expense/', $scope.newExpense).success(function (expense) {
      toastr.success('Expense created.');
      $scope.expenses.push(expense);
      jQuery('#new-expense-close').click();
    }).error(function (error) {
      console.log(error);
      toastr.error('Error creating expense.');
      AuthSvc.handleError(error);
    });
  };



}]);

