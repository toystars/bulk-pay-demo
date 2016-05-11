bulkPay.controller('EmployeeSelfExpenseCtrl', ['$scope', 'toastr', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, toastr, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.dataFetched = false;
  $scope.newExpense = {};
  $scope.expenses = [];
  $scope.options = {
    placeholder: "Select a Task",
    allowClear: true
  };
  var businessId = $cookies.get('selfBusinessId');
  var employeeId = $cookies.get('selfEmployeeId');

  var resetNewExpense = function () {
    $scope.newExpense = {};
  };

  resetNewExpense();

  $http.get('/api/expense/employee/' + employeeId).success(function (expenses) {
    $scope.expenses = expenses;
    $scope.dataFetched = true;
  }).error(function (error) {
    console.log(error);
    AuthSvc.handleError(error);
  });


  $scope.$parent.inView = 'Expense Reports';
  $scope.options = {
    placeholder: "Choose One"
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

