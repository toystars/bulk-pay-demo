bulkPay.controller('EmployeeSelfExpenseCtrl', ['$scope', 'imageUploader', '$timeout', 'toastr', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, imageUploader, $timeout, toastr, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

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
  $scope.expenseTypes = [{
    id: 'PDL',
    name: 'Per Diem (Local)',
    fixed: true,
    amount: 4500
  }, {
    id: 'PDI',
    name: 'Per Diem (International)',
    fixed: true,
    amount: 7200
  }, {
    id: 'LCP',
    name: 'Local Transport',
    fixed: false,
    amount: 0
  }];
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
    $scope.isEdit = false;
    $scope.newExpense = {
      attachments: [],
      from: moment()._d,
      to: moment()._d
    };
  };

  var workdayCount = function (start, end) {
    var first = start.clone().endOf('week');
    var last = end.clone().startOf('week');
    var days = last.diff(first, 'days') * 5 / 7;
    var wfirst = first.day() - start.day();
    if (start.day() == 0) --wfirst;
    var wlast = end.day() - last.day();
    if (end.day() == 6) --wlast;
    return wfirst + days + wlast;
  };


  var getEmployeeExpenses = function () {
    $scope.dataFetched = false;
    var andArray = [{
      employeeId: employeeId
    }, {
      createdAt: {
        '$gte': moment($scope.filter.startDate).startOf('day'),
        '$lte': moment($scope.filter.endDate).endOf('day')
      }
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
    $http.post('/api/expense/employee/filtered', {$and: andArray}).success(function (expenses) {
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
      case 'Rejected':
        return 'label label-danger';
    }
  };


  $scope.createExpense = function () {
    $scope.newExpense.employeeId = employeeId;
    $scope.newExpense.employee = employeeId;
    $scope.newExpense.businessId = businessId;
    $http.post('/api/expense/', $scope.newExpense).success(function (expense) {
      $timeout(function () {
        toastr.success('Expense created.');
        resetNewExpense();
        jQuery('#new-expense-close').click();
        $scope.files = [];
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
    $http.put('/api/expense/' + $scope.newExpense._id, $scope.newExpense).success(function (editedExpense) {
      $timeout(function () {
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

  $scope.evaluateExpense = function () {
    var sum = 0;
    var days = Math.round(workdayCount(moment($scope.newExpense.from), moment($scope.newExpense.to)));
    var expenseType = _.find($scope.expenseTypes, function (expenseType) {
      return expenseType.id === $scope.newExpense.type;
    });
    $scope.newExpense.amount = expenseType ? days * expenseType.amount : sum;
  };

  $scope.getExpenseTypeStatus = function () {
    var expenseType = _.find($scope.expenseTypes, function (expenseType) {
      return expenseType.id === $scope.newExpense.type;
    });
    return expenseType ? expenseType.fixed : false;
  };


  $scope.uploadAttachments = function () {
    if ($scope.files) {
      _.each($scope.files, function (file, index) {
        imageUploader.imageUpload(file).progress(function (evt) {
          $scope.cloudinaryRequest = true;
        }).success(function (data) {
          $scope.newExpense.attachments.push(data);
          if (index === $scope.files.length - 1) {
            toastr.success('Attachments uploaded successfully.');
            $scope.createExpense();
          }
        });
      });
    } else {
      $scope.createExpense();
    }
  };

  $scope.fileSelected = function (files) {
    if (files && files.length) {
      $scope.files = files;
    }
  };

  $scope.removeAttachment = function (index) {
    $scope.files.splice(index, 1);
  };


  $scope.viewAttachments = function (attachments) {
    $scope.attachments = attachments;
    $scope.singleAttachment = $scope.attachments[0];
  };

  $scope.resetAttachments = function () {
    $scope.attachments = [];
  };

  $scope.viewSingleAttachment = function (attachment) {
    $scope.singleAttachment = attachment;
  };

  $scope.getSingleAttachmentPath = function () {
    if ($scope.singleAttachment) {
      return 'uploads/' + $scope.singleAttachment.name;
    }
  };


  $scope.getExpenseLabel = function (expense) {
    var expenseType = _.find($scope.expenseTypes, function (expenseType) {
      return expenseType.id === expense.type;
    });
    return expenseType.id + ' - ' + expenseType.name;
  };


  $scope.alterFilter = function () {
    getEmployeeExpenses();
  };


  resetNewExpense();

}]);

