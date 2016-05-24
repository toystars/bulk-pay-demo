bulkPay.controller('BusinessEmployeesTimeCtrl', ['$scope', 'imageUploader', '$timeout', 'toastr', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, imageUploader, $timeout, toastr, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.business = undefined;
  $scope.dataFetched = false;
  $scope.times = [];
  $scope.filterOptions = {
    placeholder: "Select One",
    allowClear: true
  };
  $scope.approvalStatuses = ['Pending', 'Approved', 'Declined'];

  $scope.filter = {
    startDate: moment().subtract(1, 'month')._d,
    endDate: moment()._d
  };
  $scope.$parent.inView = 'Employees Time';


  var getBusinessTimes = function () {
    $scope.dataFetched = false;
    var andArray = [{
      businessId: $scope.business._id,
      status: 'Sent'
    }, {
      date: { '$gte': $scope.filter.startDate, '$lte': $scope.filter.endDate }
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
    $http.post('/api/timetrack/admin/filtered', {$and: andArray}).success(function (times) {
      $scope.times = times;
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
    if ($scope.times.length === 0) {
      getBusinessTimes();
    }
  }

  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, businesses) {
    $scope.business = businesses;
    if ($scope.times.length === 0) {
      getBusinessTimes();
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


  $scope.approve = function (time, status) {
    var action = status ? 'Approving ' : 'Rejecting ';
    var afterAction = status ? 'approved' : 'rejected';
    var positiveButtonText = status ? 'Approve' : 'Reject';
    swal({
      title: 'Confirm?',
      text: action + 'time record is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: positiveButtonText,
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.post('/api/timetrack/' + time._id + '/approve', {
        approvalStatus: status ? 'Approved' : 'Rejected',
        approvedBy: $scope.$parent.user._id
      }).success(function (sentTime) {
        swal('Success', 'Time record has been ' + afterAction, 'success');
        getBusinessTimes();
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
      getBusinessTimes();
    }
  };


  $scope.getProjectDisplay = function (project) {
    return project.id + ' - ' + project.project;
  };

  $scope.getActivityDisplay = function (activity) {
    return activity.id + ' - ' + activity.activity;
  };

  $scope.populateTasks = function () {
    $scope.projectActivities = [];
    _.each($scope.activities, function (activity) {
      if (activity.projectId === $scope.newTask.projectId) {
        $scope.projectActivities.push(activity);
      }
    });
  };

  $scope.getProjectDisplayById = function (projectId) {
    var project = _.find($scope.projects, function (project) {
      return project.id === projectId;
    });
    return project.id + ' - ' + project.project;
  };

  $scope.getActivityDisplayById = function (activityId) {
    var activity = _.find($scope.activities, function (actvity) {
      return actvity.id === activityId;
    });
    return activity.id + ' - ' + activity.activity;
  };

  /*
   * Data
   * */
  $scope.projects = [{
    project: 'Mobilization',
    id: '1.1'
  }, {
    project: 'Final Preparation',
    id: '1.4'
  }];

  $scope.activities = [{
    id: '1.1.1',
    activity: 'Set-up and Confirm Project Resource Availability',
    projectId: '1.1'
  }, {
    id: '1.1.2',
    activity: 'Project Kick-off meeting',
    projectId: '1.1'
  }, {
    id: '1.1.3',
    activity: 'Sensitize Stakeholders on project approach and objectives',
    projectId: '1.1'
  }, {
    id: '1.1.4',
    activity: 'Update Project Workplan',
    projectId: '1.1'
  }, {
    id: '1.4.1',
    activity: 'Prepare Impact Mapping Document for new Processes',
    projectId: '1.4'
  }, {
    id: '1.4.2',
    activity: 'Perform User Acceptance Testing',
    projectId: '1.4'
  }, {
    id: '1.4.3',
    activity: 'Sign off User Acceptance Testing',
    projectId: '1.4'
  }, {
    id: '1.1.4',
    activity: 'Perform Project Accountant Training',
    projectId: '1.4'
  }, {
    id: '1.1.5',
    activity: 'Sign off Project Accountant Training',
    projectId: '1.4'
  }, {
    id: '1.1.6',
    activity: 'Validation of new reports',
    projectId: '1.4'
  }, {
    id: '1.1.7',
    activity: 'Replication of Configuration Updates on Production client',
    projectId: '1.4'
  }, {
    id: '1.1.8',
    activity: 'Replication of Data updates on Production client',
    projectId: '1.4'
  }, {
    id: '1.1.9',
    activity: 'Cutover to Billing',
    projectId: '1.4'
  }, {
    id: '1.1.10',
    activity: 'Pilot Project Sign-off',
    projectId: '1.4'
  }, {
    id: '1.1.11',
    activity: 'Share Pilot project report with BAFC, Beth, Senior Management etc',
    projectId: '1.4'
  }];


}]);

