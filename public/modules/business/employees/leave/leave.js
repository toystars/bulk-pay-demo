bulkPay.controller('BusinessEmployeesLeaveCtrl', ['$scope', 'imageUploader', '$timeout', 'toastr', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, imageUploader, $timeout, toastr, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });
  
  $scope.business = undefined;
  $scope.dataFetched = false;
  $scope.leaves = [];
  $scope.filterOptions = {
    placeholder: "Select One",
    allowClear: true
  };
  $scope.approvalStatuses = ['Pending', 'Approved', 'Declined'];

  $scope.filter = {
    startDate: moment().subtract(1, 'month')._d,
    endDate: moment()._d
  };
  $scope.$parent.inView = 'Employees Leave';


  var getBusinessLeaves = function () {
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
    $http.post('/api/leave/admin/filtered', {$and: andArray}).success(function (leaves) {
      $scope.leaves = leaves;
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
    if ($scope.leaves.length === 0) {
      getBusinessLeaves();
    }
  }

  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, businesses) {
    $scope.business = businesses;
    if ($scope.leaves.length === 0) {
      getBusinessLeaves();
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


  $scope.approve = function (leave, status) {
    var action = status ? 'Approving ' : 'Rejecting ';
    var afterAction = status ? 'approved' : 'rejected';
    var positiveButtonText = status ? 'Approve' : 'Reject';
    swal({
      title: 'Confirm?',
      text: action + 'leave record is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: positiveButtonText,
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.post('/api/leave/' + leave._id + '/approve', {
        approvalStatus: status ? 'Approved' : 'Rejected',
        approvedBy: $scope.$parent.user._id
      }).success(function (sentLeave) {
        swal('Success', 'Leave record has been ' + afterAction, 'success');
        getBusinessLeaves();
      }).error(function (error) {
        console.log(error);
        AuthSvc.handleError(error);
      });
    });
  };


  $scope.getServicedStatus = function (servicedStatus) {
    return servicedStatus ? 'Serviced' : 'Not Serviced';
  };


  $scope.alterFilter = function () {
    if ($scope.business) {
      getBusinessLeaves();
    }
  };


}]);

