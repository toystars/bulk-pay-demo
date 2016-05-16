bulkPay.controller('EmployeeSelfExpenseCtrl', ['$scope', '$timeout', 'toastr', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $timeout, toastr, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.dataFetched = false;
  $scope.isEdit = false;
  $scope.newExpense = {};
  $scope.expenses = [];
  $scope.filterOptions = {
    placeholder: "Select One",
    allowClear: true
  };
  var businessId = $cookies.get('selfBusinessId');
  var employeeId = $cookies.get('selfEmployeeId');
  $scope.filter = {
    startDate: moment().subtract(1, 'month')._d,
    endDate: moment()._d
  };
  $scope.approvalStatuses = ['Pending', 'Approved', 'Declined'];
  $scope.statuses = ['Draft', 'Sent'];
  $scope.$parent.inView = 'Expense Reports';
  var resetNewExpense = function () {
    $scope.newExpense = {
      from: moment()._d,
      to: moment()._d
    };
  };


  var getEmployeeExpenses = function () {
    $scope.dataFetched = false;
    var andArray = [{
      employeeId: employeeId
    }, {
      createdAt: { '$gte': moment($scope.filter.startDate).startOf('day'), '$lte': moment($scope.filter.endDate).endOf('day') }
    }];
    var keys = Object.keys($scope.filter);
    if (keys.length > 0) {
      for (var x = 0; x < keys.length; x++) {
        if ($scope.filter.hasOwnProperty(keys[x]) && keys[x] !== 'startDate' && keys[x] !== 'endDate') {
          if ($scope.filter[keys[x]] && $scope.filter[keys[x]] !== '') {
            var object = {};
            object[keys[x]] = $scope.filter[keys[x]];
            andArray.push(object);
          }
        }
      }
    }
    $http.post('/api/expense/employee/filtered', { $and: andArray }).success(function (expenses) {
      $scope.expenses = expenses;
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


  $scope.getLabelClass = function (approvalStatus) {
    switch (approvalStatus) {
      case 'Pending':
        return 'label label-info';
      case 'Approved':
        return 'label label-success';
      case 'Declined':
        return 'label label-danger';
    }
  };


  $scope.createExpense = function () {
    $scope.newExpense.employeeId = employeeId;
    $scope.newExpense.businessId = businessId;
    $http.post('/api/expense/', $scope.newExpense).success(function (expense) {
      $timeout(function() {
        toastr.success('Expense created.');
        resetNewExpense();
        jQuery('#new-expense-close').click();
        getEmployeeExpenses();
      });
    }).error(function (error) {
      console.log(error);
      toastr.error('Error creating expense.');
      AuthSvc.handleError(error);
    });
  };


  $scope.edit = function (expense) {
    $scope.isEdit = true;
    angular.copy(expense, $scope.newExpense);
    jQuery('#new-expense-modal-button').click();
  };


  $scope.update = function () {
    $http.put('/api/expense/' +  $scope.newExpense._id, $scope.newExpense).success(function (editedExpense) {
      $timeout(function() {
        resetNewExpense();
        jQuery('#new-expense-close').click();
        swal('Updated!', 'Expense record has been updated successfully.', 'success');
        getEmployeeExpenses();
      });
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


  $scope.send = function (expense) {
    swal({
      title: 'Confirm and Send?',
      text: 'Sending expense record is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Send',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.put('/api/expense/' + expense._id + '/send').success(function (sentExpense) {
        swal('Sent!', 'Expense record has been confirmed and sent.', 'success');
        getEmployeeExpenses();
      }).error(function (error) {
        console.log(error);
        AuthSvc.handleError(error);
      });
    });
  };


  $scope.delete = function (expense) {
    swal({
      title: 'Confirm',
      text: 'Deleting expense record is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/expense/' + expense._id).success(function (deletedExpense) {
        swal('Deleted!', 'Expense record has been deleted..', 'success');
        getEmployeeExpenses();
      }).error(function (error) {
        console.log(error);
        AuthSvc.handleError(error);
      });
    });
  };
  
  $scope.getServicedStatus = function (servicedStatus) {
    return servicedStatus ? 'Serviced' : 'Not Serviced';
  };


  $scope.getModalTitle = function () {
    return $scope.isEdit ? 'Update Expense Record' : 'Create Expense Record';
  };

  $scope.cancel = function () {
    resetNewExpense();
  };


  $scope.alterFilter = function () {
    getEmployeeExpenses();
  };



  resetNewExpense();

}]);

