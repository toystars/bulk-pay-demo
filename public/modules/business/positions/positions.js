
bulkPay.controller('BusinessPositionsCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.position = {};
  $scope.positions = [];
  $scope.businessUnits = [];
  $scope.divisions = [];
  $scope.departments = [];
  $scope.$parent.inView = 'Positions';
  var businessId = '';
  $scope.options = {
    placeholder: "Choose One",
    allowClear: true
  };
  $scope.dataFetched = false;

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getPositions = function (businessId) {
    $http.get('/api/positions/business/' + businessId).success(function (data) {
      $scope.positions = data;
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
    })
  };

  var getBusinessUnits = function (businessId) {
    $http.get('/api/businessunits/business/' + businessId).success(function (data) {
      $scope.businessUnits = data;
    }).error(function (error) {
      console.log(error);
    })
  };

  var getBusinessDivisions = function (businessId) {
    $http.get('/api/divisions/business/' + businessId).success(function (data) {
      $scope.divisions = data;
    }).error(function (error) {
      console.log(error);
    })
  };

  var getDepartments = function (businessId) {
    $http.get('/api/departments/business/' + businessId).success(function (data) {
      $scope.departments = data;
    }).error(function (error) {
      console.log(error);
    })
  };


  var resetPosition = function () {
    $scope.position = {
      businessId: businessId,
      headingSection: '',
      headingSectionId: ''
    };
  };



  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    resetPosition();
    getPositions(businessId);
    getBusinessUnits(businessId);
    getBusinessDivisions(businessId);
    getDepartments(businessId);
  });


  $scope.createPosition = function () {
    switch ($scope.position.headingSection) {
      case 'Business Unit':
        $scope.position.headingSectionId = $scope.position.businessUnitId;
        $scope.position.divisionId = '';
        $scope.position.departmentId = '';
        break;
      case 'Division':
        $scope.position.headingSectionId = $scope.position.divisionId;
        $scope.position.departmentId = '';
        break;
      case 'Department':
        $scope.position.headingSectionId = $scope.position.departmentId;
        break;
      default:
        $scope.position.headingSectionId = '';
        break;
    }
    $http.post('/api/positions/', $scope.position).success(function (data) {
      $scope.positions.push(data);
      jQuery('#new-position-close').click();
      resetPosition();
      swal('Success', data.name + ' Position created.', 'success');
    }).error(function (error) {
      console.log(error);
    });
  };



  /*
   * Helpers
   * */

  $scope.filteredDivisions = [];
  $scope.$watch('singlePosition.businessUnitId', function (newValue, oldValue) {
    if (newValue !== oldValue) {
      var divisions = [];
      for (var x = 0; x < $scope.divisions.length; x++) {
        if ($scope.singlePosition.businessUnitId && $scope.singlePosition.businessUnitId !== '') {
          if ($scope.singlePosition.businessUnitId === $scope.divisions[x].businessUnitId) {
            divisions.push($scope.divisions[x]);
          }
        } else {
          divisions.push($scope.divisions[x]);
        }
      }
      $scope.filteredDivisions = divisions;
    }
  });

  $scope.filteredDepartments = [];
  $scope.$watch('singlePosition.divisionId', function (newValue, oldValue) {
    if (newValue !== oldValue) {
      var departments = [];
      _.each($scope.departments, function (department) {
        if ($scope.singlePosition.divisionId && $scope.singlePosition.divisionId !== '') {
          if ($scope.singlePosition.divisionId === department.divisionId || _.find(department.divisionsServed, function (id) { return id == $scope.singlePosition.divisionId; })) {
            departments.push(department);
          }
        } else {
          departments.push(department);
        }
      });
      $scope.filteredDepartments = departments;
    }
  });

  $scope.filteredPositions = [];
  $scope.$watch('singlePosition._id', function (newValue, oldValue) {
    if (newValue !== oldValue) {
      var positions = [];
      for (var x = 0; x < $scope.positions.length; x++) {
        if ($scope.singlePosition._id && $scope.positions[x]._id !== $scope.singlePosition._id && $scope.positions[x].parentPositionId !== $scope.singlePosition._id) {
          positions.push($scope.positions[x]);
        }
      }
    }
    $scope.filteredPositions = positions;
  });

  $scope.filteredNewDivisions = [];
  $scope.$watch('position.businessUnitId', function (newValue, oldValue) {
    if (newValue !== oldValue) {
      $scope.position.divisionId = '';
      var divisions = [];
      for (var x = 0; x < $scope.divisions.length; x++) {
        if ($scope.position.businessUnitId && $scope.position.businessUnitId !== '') {
          if ($scope.position.businessUnitId === $scope.divisions[x].businessUnitId) {
            divisions.push($scope.divisions[x]);
          }
        } else {
          divisions.push($scope.divisions[x]);
        }
      }
      $scope.filteredNewDivisions = divisions;
    }
  });

  $scope.filteredNewDepartments = [];
  $scope.$watch('position.divisionId', function (newValue, oldValue) {
    if (newValue !== oldValue) {
      $scope.position.departmentId = '';
      var departments = [];
      _.each($scope.departments, function (department) {
        if ($scope.position.divisionId && $scope.position.divisionId !== '') {
          if ($scope.position.divisionId === department.divisionId || department.divisionsServed[0] === 'All' || _.find(department.divisionsServed, function (id) { return id == $scope.position.divisionId; })) {
            departments.push(department);
          }
        } else {
          departments.push(department);
        }
      });
      $scope.filteredNewDepartments = departments;
    }
  });


  $scope.getUnitName = function (id) {
    for (var x = 0; x < $scope.businessUnits.length; x++) {
      if ($scope.businessUnits[x]._id === id) {
        return $scope.businessUnits[x].name;
      }
    }
  };

  $scope.getDivisionName = function (id) {
    for (var x = 0; x < $scope.divisions.length; x++) {
      if ($scope.divisions[x]._id === id) {
        return $scope.divisions[x].name;
      }
    }
  };

  $scope.getParentPositionName = function (id) {
    for (var x = 0; x < $scope.positions.length; x++) {
      if ($scope.positions[x]._id === id) {
        return $scope.positions[x].name;
      }
    }
  };

  $scope.getDepartmentName = function (id) {
    for (var x = 0; x < $scope.departments.length; x++) {
      if ($scope.departments[x]._id === id) {
        return $scope.departments[x].name;
      }
    }
  };

  $scope.getHeadName = function (head, id) {
    switch (head) {
      case 'Business Unit':
        return $scope.getUnitName(id);
      case 'Division':
        return $scope.getDivisionName(id);
        break;
      case 'Department':
        return $scope.getDepartmentName(id);
        break;
    }
  };

  $scope.getLastHistory = function () {
    return $scope.histories[$scope.histories.length - 1];
  };

  var removeFromCollection = function (id) {
    for (var x = 0; x < $scope.positions.length; x++) {
      if ($scope.positions[x]._id === id) {
        $scope.positions.splice(x, 1);
      }
    }
  };

  var replace = function (data) {
    for (var x = 0; x < $scope.positions.length; x++) {
      if ($scope.positions[x]._id === data._id) {
        $scope.positions[x] = data;
      }
    }
  };

  var getHistories = function (objectId) {
    $http.get('/api/histories/object/' + objectId).success(function (data) {
      $scope.histories = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  /*
  * Input disabling functions
  * */
  $scope.disableDivision = function () {
    return $scope.position.headingSection === 'Business Unit';
  };
  $scope.disableDepartment = function () {
    return $scope.position.headingSection === 'Business Unit' || $scope.position.headingSection === 'Division';
  };
  $scope.disableUpdateDivision = function () {
    return $scope.singlePosition.headingSection === 'Business Unit';
  };
  $scope.disableUpdateDepartment = function () {
    return $scope.singlePosition.headingSection === 'Business Unit' || $scope.singlePosition.headingSection === 'Division';
  };


  /*
   * Single position display
   * */
  $scope.singleView = false;
  $scope.editActive = false;
  $scope.singlePosition = {};
  $scope.oldPosition = {};
  $scope.histories = [];
  $scope.positionEmployees = [];

  $scope.showPosition = function (position) {
    $scope.singleView = true;
    $scope.positionEmployees = [];
    angular.copy(position, $scope.oldPosition);
    angular.copy(position, $scope.singlePosition);
    getHistories($scope.singlePosition._id);
    getPositionEmployees($scope.singlePosition._id);
  };

  $scope.edit = function () {
    $scope.editActive = true;
    angular.copy($scope.oldPosition, $scope.singlePosition);
  };

  $scope.cancel = function () {
    $scope.editActive = false;
  };

  var getPositionEmployees = function (positionId) {
    $http.get('/api/employees/position/' + positionId).success(function (data) {
      $scope.positionEmployees = data;
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };

  $scope.employeeInfoReady = function () {

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
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };

  $scope.changeEmployee = function (id) {
    getSingleEmployeeInfo(id);
  };

  $scope.viewEmployee = function (employee) {
    $scope.singleEmployee = employee;
    jQuery('#position-employee-modal-button').click();
    getSingleEmployeeInfo(employee._id);
  };

  $scope.resetEmployee = function () {
    $scope.singleEmployee = {};
  };

  $scope.delete = function () {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + $scope.singlePosition.name + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/positions/' + $scope.singlePosition._id).success(function (data) {
        swal('Deleted!', $scope.singlePosition.name + ' position deleted.', 'success');
        removeFromCollection($scope.singlePosition._id);
        $scope.closePosition();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
        console.log(error);
      });
    });
  };

  $scope.closePosition = function () {
    $scope.singlePosition = {};
    $scope.singleView = false;
    $scope.positionEmployees = [];
  };

  $scope.updatePosition = function () {
    switch ($scope.singlePosition.headingSection) {
      case 'Business Unit':
        $scope.singlePosition.headingSectionId = $scope.singlePosition.businessUnitId;
        $scope.singlePosition.divisionId = '';
        $scope.singlePosition.departmentId = '';
        break;
      case 'Division':
        $scope.singlePosition.headingSectionId = $scope.singlePosition.divisionId;
        $scope.singlePosition.departmentId = '';
        break;
      case 'Department':
        $scope.singlePosition.headingSectionId = $scope.singlePosition.departmentId;
        break;
      default:
        $scope.singlePosition.headingSectionId = '';
        break;
    }
    $http.put('/api/positions/' + $scope.singlePosition._id, $scope.singlePosition).success(function (data) {
      getHistories(data._id);
      angular.copy(data, $scope.oldPosition);
      angular.copy(data, $scope.singlePosition);
      $scope.editActive = false;
      replace(data);
      swal("Success", "Position updated.", "success");
    }).error(function (error) {
      console.log(error);
    });
  };


  $scope.choices = ['Yes', 'No'];
  $scope.statuses = ['Active', 'Inactive'];
  $scope.headingSections = ['Business Unit', 'Division', 'Department'];

}]);

