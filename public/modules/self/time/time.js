bulkPay.controller('EmployeeSelfTimeCtrl', ['$scope', 'toastr', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', '$timeout', function ($scope, toastr, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state, $timeout) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.projectActivities = [];
  $scope.currentPage = 1;
  $scope.pageSize = 25;
  $scope.dataFetched = false;
  $scope.isEdit = false;
  $scope.newTask = {};
  $scope.times = [];
  $scope.options = {
    placeholder: "Select a Task",
    allowClear: true
  };
  $scope.filterOptions = {
    placeholder: "Select One",
    allowClear: true
  };
  $scope.filter = {
    startDate: moment().subtract(1, 'month')._d,
    endDate: moment()._d
  };
  $scope.approvalStatuses = ['Pending', 'Approved', 'Declined'];
  $scope.statuses = ['Draft', 'Sent'];
  var businessId = $cookies.get('selfBusinessId');
  var employeeId = $cookies.get('selfEmployeeId');

  var resetNewTask = function () {
    $scope.isEdit = false;
    $scope.newTask = {
      date: moment()._d,
      description: ''
    };
  };

  var getEmployeeTimeTracks = function () {
    $scope.dataFetched = false;
    var andArray = [{
      employeeId: employeeId
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
    $http.post('/api/timetrack/employee/filtered', { $and: andArray }).success(function (times) {
      $scope.times = times;
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };

  $scope.$parent.inView = 'Time Reports';
  $scope.options = {
    placeholder: "Select Task"
  };

  $scope.analyzeDuration = function () {
    $scope.newTask.displayDuration = $scope.newTask.displayDuration || '0:00';
    var splitTime = $scope.newTask.displayDuration.split(':');
    var hours = parseInt(splitTime[0]);
    var minutes = parseInt(splitTime[1]);
    var fullMinutes = (hours * 60) + minutes;
    var analyzedTime = fullMinutes / 60;
    $scope.newTask.time = Number(Math.round(analyzedTime + 'e2') + 'e-2');
    $scope.newTask.labeledDuration = $scope.newTask.time + ' hours';
  };


  $scope.addTimeLog = function () {
    $scope.newTask.employeeId = employeeId;
    $scope.newTask.employee = employeeId;
    $scope.newTask.businessId = businessId;
    $http.post('/api/timetrack/', $scope.newTask).success(function (time) {
      $timeout(function() {
        toastr.success('Time Log created.');
        resetNewTask();
        jQuery('#log-time-close').click();
        getEmployeeTimeTracks();
      });
    }).error(function (error) {
      console.log(error);
      toastr.error('Time Log error.');
      AuthSvc.handleError(error);
    });
  };


  $scope.edit = function (time) {
    $scope.isEdit = true;
    angular.copy(time, $scope.newTask);
    jQuery('#log-modal-button').click();
  };


  $scope.update = function () {
    $http.put('/api/timetrack/' +  $scope.newTask._id, $scope.newTask).success(function (editedTime) {
      $timeout(function() {
        resetNewTask();
        jQuery('#log-time-close').click();
        swal('Updated!', 'Time record has been updated successfully.', 'success');
        getEmployeeTimeTracks();
      });
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


  $scope.send = function (time) {
    swal({
      title: 'Confirm and Send?',
      text: 'Sending time record is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Send',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.put('/api/timetrack/' + time._id + '/send').success(function (sentTime) {
        swal('Sent!', 'Time record has been confirmed and sent.', 'success');
        getEmployeeTimeTracks();
      }).error(function (error) {
        console.log(error);
        AuthSvc.handleError(error);
      });
    });
  };


  $scope.cancel = function () {
    resetNewTask();
  };

  $scope.delete = function (time) {
    swal({
      title: 'Confirm',
      text: 'Deleting time record is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/timetrack/' + time._id).success(function (deletedTime) {
        swal('Deleted!', 'Time record has been deleted..', 'success');
        getEmployeeTimeTracks();
      }).error(function (error) {
        console.log(error);
        AuthSvc.handleError(error);
      });
    });
  };


  $scope.getModalTitle = function () {
    return $scope.isEdit ? 'Edit Time Record' : 'Log Time Worked';
  };


  $scope.getTaskName = function (code) {
    return _.find($scope.tasks, function (task) {
      return task.code === code;
    }).name.toUpperCase();
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

  $scope.alterFilter = function () {
    getEmployeeTimeTracks();
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

  $scope.setProject = function (project) {
    $scope.newTask.projectId = project.id;
    $scope.populateTasks();
    jQuery('#log-modal-button').click();
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

  resetNewTask();



}]);

