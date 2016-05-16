bulkPay.controller('EmployeeSelfLeaveCtrl', ['$scope', '$timeout', 'toastr', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $timeout, toastr, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.dataFetched = false;
  $scope.newLeave = {};
  $scope.leaves = [];
  $scope.employeePosition = {};
  $scope.isEdit = false;
  var businessId = $cookies.get('selfBusinessId');
  var employeeId = $cookies.get('selfEmployeeId');
  $scope.approvalStatuses = ['Pending', 'Approved', 'Declined'];
  $scope.statuses = ['Draft', 'Sent'];
  $scope.leaveTypes = ['Sick Leave', 'Vacation', 'Casual Leave', 'Annual Leave', 'Study Leave'];
  $scope.$parent.inView = 'Leave Requests';
  $scope.options = {
    placeholder: "Choose One",
    allowClear: true
  };
  $scope.filter = {
    startDate: moment().subtract(1, 'month')._d,
    endDate: moment()._d
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

  var resetNewLeave = function () {
    $scope.newLeave = {
      duration: 0,
      endDate: moment().add(1, 'week')._d,
      startDate: moment().add(1, 'day')._d
    };
  };

  var getEmployeePosition = function () {
    $http.get('/api/leave/employee/' + employeeId + '/position').success(function (position) {
      $scope.employeePosition = position;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


  var getFilteredEmployeeLeaves = function () {
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
    $http.post('/api/leave/employee/filtered', { $and: andArray }).success(function (leaves) {
      $scope.leaves = leaves;
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


  $scope.createLeave = function () {
    $scope.newLeave.employeeId = employeeId;
    $scope.newLeave.businessId = businessId;
    $scope.newLeave.employee = employeeId;
    $http.post('/api/leave/', $scope.newLeave).success(function (leave) {
      $timeout(function() {
        toastr.success('Leave created.');
        $scope.leaves.push(leave);
        jQuery('#new-leave-close').click();
        resetNewLeave();
      });
    }).error(function (error) {
      console.log(error);
      toastr.error('Error creating leave.');
      AuthSvc.handleError(error);
    });
  };


  $scope.edit = function (leave) {
    $scope.isEdit = true;
    angular.copy(leave, $scope.newLeave);
    jQuery('#new-leave-modal-button').click();
  };


  $scope.update = function () {
    $http.put('/api/leave/' +  $scope.newLeave._id, $scope.newLeave).success(function (editedLeave) {
      $timeout(function() {
        resetNewLeave();
        jQuery('#new-leave-close').click();
        swal('Updated!', 'Leave record has been updated successfully.', 'success');
        getFilteredEmployeeLeaves();
      });
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


  $scope.send = function (leave) {
    swal({
      title: 'Confirm and Send?',
      text: 'Sending leave record is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Send',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.put('/api/leave/' + leave._id + '/send').success(function (sentLeave) {
        swal('Sent!', 'Leave record has been confirmed and sent.', 'success');
        getFilteredEmployeeLeaves();
      }).error(function (error) {
        console.log(error);
        AuthSvc.handleError(error);
      });
    });
  };


  $scope.delete = function (leave) {
    swal({
      title: 'Confirm',
      text: 'Deleting leave record is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/leave/' + leave._id).success(function (deletedLeave) {
        swal('Deleted!', 'Leave record has been deleted..', 'success');
        getFilteredEmployeeLeaves();
      }).error(function (error) {
        console.log(error);
        AuthSvc.handleError(error);
      });
    });
  };

  $scope.setDuration = function () {
    $scope.newLeave.duration = Math.round(workdayCount(moment($scope.newLeave.startDate), moment($scope.newLeave.endDate)));
  };

  $scope.getPendingLeaveDays = function () {
    var sum = 0;
    _.each($scope.leaves, function (leave) {
      if (leave.approvalStatus === 'Pending') {
        sum += leave.duration;
      }
    });
    return sum;
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

  $scope.getModalTitle = function () {
    return $scope.isEdit ? 'Edit Leave Request' : 'New Leave Request';
  };

  $scope.alterFilter = function () {
    getFilteredEmployeeLeaves();
  };
  
  $scope.enableCreateButton = function () {
    if ($scope.$parent.employee) {
      return ($scope.employeePosition.leaveDays - $scope.$parent.employee.leaveDaysTaken - $scope.getPendingLeaveDays()) > 0;
    } else {
      return true;
    }
  };

  $scope.invalidLeaveDays = function () {
    if ($scope.$parent.employee) {
      return $scope.newLeave.duration > ($scope.employeePosition.leaveDays - $scope.$parent.employee.leaveDaysTaken - $scope.getPendingLeaveDays());
    } else {
      return true;
    }
  };


  $scope.cancel = function () {
    resetNewLeave();
  };


  resetNewLeave();
  getEmployeePosition();

}]);

