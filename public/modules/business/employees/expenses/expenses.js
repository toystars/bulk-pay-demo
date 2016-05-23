bulkPay.controller('BusinessEmployeesExpensesCtrl', ['$scope', 'imageUploader', '$timeout', 'toastr', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, imageUploader, $timeout, toastr, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.attachments = [];
  $scope.business = undefined;
  $scope.dataFetched = false;
  $scope.expenses = [];
  $scope.filterOptions = {
    placeholder: "Select One",
    allowClear: true
  };
  $scope.approvalStatuses = ['Pending', 'Approved', 'Declined'];

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

  $scope.filter = {
    startDate: moment().subtract(1, 'month')._d,
    endDate: moment()._d
  };
  $scope.$parent.inView = 'Employees Expenses';


  var getBusinessExpenses = function () {
    $scope.dataFetched = false;
    var andArray = [{
      businessId: $scope.business._id,
      status: 'Sent'
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
    $http.post('/api/expense/admin/filtered', {$and: andArray}).success(function (expenses) {
      $scope.expenses = expenses;
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    $scope.business = BusinessDataSvc.getBusiness();
    if ($scope.expenses.length === 0) {
      getBusinessExpenses();
    }
  }

  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, businesses) {
    $scope.business = businesses;
    if ($scope.expenses.length === 0) {
      getBusinessExpenses();
    }
  });



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


  $scope.approve = function (expense, status) {
    var action = status ? 'Approving ' : 'Rejecting ';
    var afterAction = status ? 'approved' : 'rejected';
    var positiveButtonText = status ? 'Approve' : 'Reject';
    swal({
      title: 'Confirm?',
      text: action + 'expense record is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: positiveButtonText,
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.post('/api/expense/' + expense._id + '/approve', {
        approvalStatus: status ? 'Approved' : 'Rejected',
        approvedBy: $scope.$parent.user._id
      }).success(function (sentExpense) {
        swal('Success', 'Expense record has been ' + afterAction, 'success');
        getBusinessExpenses();
      }).error(function (error) {
        console.log(error);
        AuthSvc.handleError(error);
      });
    });
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


  $scope.getServicedStatus = function (servicedStatus) {
    return servicedStatus ? 'Serviced' : 'Not Serviced';
  };


  $scope.getExpenseLabel = function (expense) {
    var expenseType = _.find($scope.expenseTypes, function (expenseType) {
      return expenseType.id === expense.type;
    });
    return expenseType.id + ' - ' + expenseType.name;
  };

  $scope.alterFilter = function () {
    if ($scope.business) {
      getBusinessExpenses();
    }
  };


}]);

