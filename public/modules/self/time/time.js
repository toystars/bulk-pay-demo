bulkPay.controller('EmployeeSelfTimeCtrl', ['$scope', 'toastr', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, toastr, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.dataFetched = false;
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
  $scope.approvalStatuses = ['Pending', 'Approved', 'Rejected'];
  $scope.statuses = ['Draft', 'Sent'];
  var businessId = $cookies.get('selfBusinessId');
  var employeeId = $cookies.get('selfEmployeeId');

  var resetNewTask = function () {
    $scope.newTask = {
      displayDuration: '0:00',
      labeledDuration: '0 hours',
      taskCode: '',
      time: 0,
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
      toastr.success('Time Log created.');
      $scope.times.push(time);
      jQuery('#log-time-close').click();
    }).error(function (error) {
      console.log(error);
      toastr.error('Time Log error.');
      AuthSvc.handleError(error);
    });
  };


  $scope.getTaskDisplay = function (task) {
    return task.name + ' - ' + task.code;
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

  
  /*
  * Data
  * */
  $scope.tasks = [{
    code: 'TDC',
    name: 'TradeDepot',
    phase: 'Main',
    parentCode: ''
  }, {
    code: 'TDC-DSG',
    name: 'TradeDepot Design',
    phase: 'Design',
    parentCode: 'TDC'
  }, {
    code: 'TDC-OPS',
    name: 'TradeDepot Dev Ops',
    phase: 'Dev Ops',
    parentCode: 'TDC'
  }, {
    code: 'TDC-TST',
    name: 'TradeDepot Testing',
    phase: 'Testing',
    parentCode: 'TDC'
  }, {
    code: 'TDC-UTST',
    name: 'TradeDepot Testing (Unit)',
    phase: 'Unit Testing',
    parentCode: 'TDC-TST'
  }, {
    code: 'BLP',
    name: 'BulkPay',
    phase: 'Main',
    parentCode: ''
  }, {
    code: 'BLP-FRT',
    name: 'BulkPay Frontend',
    phase: 'Design',
    parentCode: 'BLP'
  }, {
    code: 'ADM',
    name: 'Administration',
    phase: 'Front Desk',
    parentCode: ''
  }, {
    code: 'ENG',
    name: 'Engineering (Server)',
    phase: 'Maintenance',
    parentCode: ''
  }];

  resetNewTask();
  getEmployeeTimeTracks();

}]);

