bulkPay.controller('BusinessOrgChartCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', 'toastr', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state, toastr) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.$parent.inView = 'Org Chart';
  var businessId = '';
  var positions = [];
  var employees = [];


  var getPositions = function (businessId) {
    $http.get('/api/positions/business/' + businessId).success(function (data) {
      positions = data;
      getEmployees(businessId);
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };

  var getEmployees = function (businessId) {
    $http.get('/api/employees/business/' + businessId).success(function (data) {
      employees = data;
      restructurePositions(positions);
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    businessId = BusinessDataSvc.getBusinessId();
    $scope.business = BusinessDataSvc.getBusiness();
    getPositions(businessId);
  }


  var restructurePositions = function (positions) {
    var parentPosition = _.find(positions, function (position) {
      return !position.parentPositionId || position.parentPositionId === '';
    });
    if (parentPosition) {
      plotChart({
        title: parentPosition.name,
        name: getStructuredEmployeeDetails(getPositionEmployee(parentPosition._id)),
        callBack: showProfileSummary,
        employee: getEmployee(parentPosition._id),
        relationship: hasChildren(parentPosition) ? '001' : '000',
        children: getChildren(parentPosition)
      });
    }
  };

  var getChildren = function (parentPosition) {
    var children = [];
    _.each(positions, function (position) {
      if (position.parentPositionId === parentPosition._id) {
        children.push({
          title: position.name,
          callBack: showProfileSummary,
          employee: getEmployee(position._id),
          name: getStructuredEmployeeDetails(getPositionEmployee(position._id)),
          relationship: hasChildren(position) ? '001' : '000',
          children: getChildren(position)
        });
      }
    });
    return children;
  };

  var hasChildren = function (currentPosition) {
    return _.find(positions, function (position) {
      return position.parentPositionId === currentPosition._id;
    });
  };

  var getEmployee = function (positionId) {
    return _.find(employees, function (employee) {
      return employee.positionId === positionId;
    });
  };

  var getStructuredEmployeeDetails = function (employee) {
    var mainDiv = '<div>';
    mainDiv += getEmployeeImage(employee);
    mainDiv += '<br />';
    mainDiv += getEmployeeName(employee);
    mainDiv += '</div>';
    return mainDiv;
  };

  var getEmployeeName = function (employee) {
    var fullName = employee ? employee.fullName : 'No employee assigned';
    return '<span>' + fullName + '</span>';
  };

  var getEmployeeImage = function (employee) {
    var employeeImage = '';
    if (employee) {
      employeeImage = 'uploads/' + employee.currentProfilePicture;
    } else {
      employeeImage = 'images/photos/avatar.jpg';
    }
    return '<img class="img-thumbnail pointer" click="data.callBack(data.employee)" width="100" height="100" alt="Employee Picture" src="' + employeeImage + '"/>';
  };

  var getPositionEmployee = function (positionId) {
    return _.find(employees, function (employee) {
      return employee.positionId === positionId;
    });
  };

  var plotChart = function (dataSource) {
    var container = jQuery('#chart-container');
    var bulkOrgChart = new BulkOrgChart(container, dataSource, 2, true);
    bulkOrgChart.createChart();
  };

  var showProfileSummary = function (employee) {
    if (employee) {
      $scope.singleEmployee = employee;
      getSingleEmployeeInfo(employee._id);
    } else {
      toastr.error('No employee available.');
    }
  };

  var getSingleEmployeeInfo = function (employeeId) {
    $http.get('/api/positions/employee/' + employeeId).success(function (data) {
      $scope.singleEmployee = data.oldEmployee;
      $scope.singleEmployee.positionName = data.newEmployee.positionName;
      $scope.singleEmployee.businessUnitName = data.newEmployee.businessUnitName;
      $scope.singleEmployee.divisionName = data.newEmployee.divisionName;
      $scope.singleEmployee.departmentName = data.newEmployee.departmentName;
      $scope.singleEmployee.payGroupName = data.newEmployee.payGroupName;
      $scope.singleEmployee.payGradeName = data.newEmployee.payGradeName;
      $scope.singleEmployee.supervisor = data.newEmployee.supervisor;
      jQuery('#position-employee-modal-button').click();
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


  /*
   * Event Listeners
   * */

  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getPositions(businessId);
  });


}]);

