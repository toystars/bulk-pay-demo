bulkPay.controller('DepartmentOverviewCtrl', ['$scope', 'toastr', 'AuthSvc', 'OrgSvc', 'PayTypesSvc', '$cookies', 'PayScalesSvc', 'StructureSvc', function ($scope, toastr, AuthSvc, OrgSvc, PayTypesSvc, $cookies, PayScalesSvc, StructureSvc) {

  AuthSvc.checkLoggedInStatus();
  OrgSvc.checkOrgStatus();
  $scope.inView = 'Departments';
  var companyId = JSON.parse($cookies.get('userCompany'))._id;




  /*
   * Department section
   * */
  $scope.departments = [];
  $scope.editDepartment = false;
  $scope.newDepartment = {};
  $scope.oldDepartment = { };
  $scope.departmentErrorOccur = false;
  $scope.departmentError = '';

  var resetDepartment = function () {
    $scope.newDepartment = {
      code: '',
      title: '',
      status: '',
      companyId: companyId
    };
  };

  var getCompanyDepartments = function () {
    StructureSvc.getCompanyDepartments(companyId).success(function (data) {
      $scope.departments = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var clearError = function () {
    $scope.departmentErrorOccur = false;
    $scope.departmentError = '';
  };

  var newDepartmentObjectEmpty = function () {
    return (!$scope.newDepartment.code || $scope.newDepartment.code === '') ||
      (!$scope.newDepartment.title || $scope.newDepartment.title === '') ||
      (!$scope.newDepartment.status || $scope.newDepartment.status === '');
  };

  var newDepartmentCodeInUse = function () {
    return isPresent($scope.departments, $scope.newDepartment, function (element, data) {
      return element.code === data.code;
    });
  };

  var validateDepartmentUpdateObject = function () {
    return isPresent($scope.departments, $scope.newDepartment, function (element, data) {
      return element.code === data.code && element._id !== data._id;
    });
  };

  var validateDepartmentUpdateObjectChange = function () {
    var keys = Object.keys($scope.oldDepartment);
    for (var x = 0; x < keys.length; x++) {
      if ($scope.oldDepartment.hasOwnProperty(keys[x])) {
        if ($scope.oldDepartment[keys[x]] !== $scope.newDepartment[keys[x]]) {
          return false;
        }
      }
    }
    return true;
  };

  resetDepartment();
  getCompanyDepartments();
  clearError();

  $scope.getDepartmentFormHeader = function () {
    return $scope.editDepartment ? 'Edit Department' : 'Create New Department';
  };

  $scope.validateDepartmentCreate = function () {
    return newDepartmentObjectEmpty() || newDepartmentCodeInUse();
  };

  $scope.createDepartment = function () {
    clearError();
    StructureSvc.createDepartment($scope.newDepartment).success(function (data) {
      resetDepartment();
      swal("Success", "Department created.", "success");
      getCompanyDepartments();
    }).error(function (error) {
      if (error.message) {
        $scope.departmentErrorOccur = true;
        $scope.departmentError = error.message;
      } else {
        console.log('Error: ', error);
      }
    });
  };

  $scope.validateDepartmentUpdate = function () {
    return newDepartmentObjectEmpty() || validateDepartmentUpdateObject() || validateDepartmentUpdateObjectChange();
  };

  $scope.triggerDepartmentEdit = function (department) {
    $scope.editDepartment = true;
    angular.copy(department, $scope.oldDepartment);
    angular.copy(department, $scope.newDepartment);
  };

  $scope.resetDepartmentEdit = function () {
    resetDepartment();
    $scope.editDepartment = false;
    $scope.oldDepartment = {};
  };

  $scope.updateDepartment = function () {
    StructureSvc.editDepartment($scope.newDepartment).success(function (data) {
      swal("Success", "Department updated.", "success");
      getCompanyDepartments();
      $scope.resetDepartmentEdit();
    }).error(function (error) {
      console.log(error);
    })
  };

  $scope.deleteDepartment = function (department) {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + department.title + ' department is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      StructureSvc.deleteDepartment(department._id, companyId).success(function (data) {
        swal('Deleted!', data.message, 'success');
        getCompanyDepartments();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
      });
    });
  };

  /*
   * End of Department section
   * */



  /*
   * Job Level section
   * */
  $scope.jobLevels = [];
  $scope.editJobLevel = false;
  $scope.newJobLevel = {};
  $scope.oldJobLevel = { };
  $scope.jobLevelErrorOccur = false;
  $scope.jobLevelError = '';

  var resetJobLevel = function () {
    $scope.newJobLevel = {
      code: '',
      title: '',
      status: '',
      companyId: companyId,
      departmentId: ''
    };
  };

  var getCompanyJobLevels = function () {
    StructureSvc.getCompanyJobLevels(companyId).success(function (data) {
      $scope.jobLevels = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var clearJobLevelError = function () {
    $scope.jobLevelErrorOccur = false;
    $scope.jobLevelError = '';
  };

  var newJobLevelObjectEmpty = function () {
    return (!$scope.newJobLevel.code || $scope.newJobLevel.code === '') ||
      (!$scope.newJobLevel.title || $scope.newJobLevel.title === '') ||
      (!$scope.newJobLevel.status || $scope.newJobLevel.status === '') ||
      (!$scope.newJobLevel.departmentId || $scope.newJobLevel.departmentId === '');
  };

  var newJobLevelCodeInUse = function () {
    return isPresent($scope.jobLevels, $scope.newJobLevel, function (element, data) {
      return element.code === data.code;
    });
  };

  var validateJobLevelUpdateObject = function () {
    return isPresent($scope.jobLevels, $scope.newJobLevel, function (element, data) {
      return element.code === data.code && element._id !== data._id;
    });
  };

  var validateJobLevelUpdateObjectChange = function () {
    var keys = Object.keys($scope.oldJobLevel);
    for (var x = 0; x < keys.length; x++) {
      if ($scope.oldJobLevel.hasOwnProperty(keys[x])) {
        if ($scope.oldJobLevel[keys[x]] !== $scope.newJobLevel[keys[x]]) {
          return false;
        }
      }
    }
    return true;
  };

  resetJobLevel();
  getCompanyJobLevels();
  clearJobLevelError();

  $scope.getJobLevelFormHeader = function () {
    return $scope.editJobLevel ? 'Edit Job Level' : 'Create New Job Level';
  };

  $scope.validateJobLevelCreate = function () {
    return newJobLevelObjectEmpty() || newJobLevelCodeInUse();
  };

  $scope.createJobLevel = function () {
    clearJobLevelError();
    StructureSvc.createJobLevel($scope.newJobLevel).success(function (data) {
      resetJobLevel();
      swal("Success", "Job level created.", "success");
      getCompanyJobLevels();
    }).error(function (error) {
      if (error.message) {
        $scope.jobLevelErrorOccur = true;
        $scope.jobLevelError = error.message;
      } else {
        console.log('Error: ', error);
      }
    });
  };

  $scope.validateJobLevelUpdate = function () {
    return newJobLevelObjectEmpty() || validateJobLevelUpdateObject() || validateJobLevelUpdateObjectChange();
  };

  $scope.triggerJobLevelEdit = function (jobLevel) {
    $scope.editJobLevel = true;
    angular.copy(jobLevel, $scope.oldJobLevel);
    angular.copy(jobLevel, $scope.newJobLevel);
  };

  $scope.resetJobLevelEdit = function () {
    resetJobLevel();
    $scope.editJobLevel = false;
    $scope.oldJobLevel = {};
  };

  $scope.updateJobLevel = function () {
    StructureSvc.editJobLevel($scope.newJobLevel).success(function (data) {
      swal("Success", "Job level updated.", "success");
      getCompanyJobLevels();
      $scope.resetJobLevelEdit();
    }).error(function (error) {
      console.log(error);
    })
  };

  $scope.deleteJobLevel = function (jobLevel) {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + jobLevel.title + ' job level is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      StructureSvc.deleteJobLevel(jobLevel._id, companyId).success(function (data) {
        swal('Deleted!', data.message, 'success');
        getCompanyDepartments();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
      });
    });
  };

  /*
   * End of Job Level section
   * */



  /*
   * Position section
   * */
  $scope.positions = [];
  $scope.editPosition = false;
  $scope.newPosition = {};
  $scope.oldPosition = { };
  $scope.positionErrorOccur = false;
  $scope.positionError = '';

  var resetPosition = function () {
    $scope.newPosition = {
      title: '',
      status: '',
      companyId: companyId,
      departmentId: '',
      jobLevelId: ''
    };
  };

  var getCompanyPositions = function () {
    StructureSvc.getCompanyPositions(companyId).success(function (data) {
      $scope.positions = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var clearPositionError = function () {
    $scope.positionErrorOccur = false;
    $scope.positionError = '';
  };

  var newPositionObjectEmpty = function () {
    return (!$scope.newPosition.title || $scope.newPosition.title === '') ||
      (!$scope.newPosition.status || $scope.newPosition.status === '') ||
      (!$scope.newPosition.jobLevelId || $scope.newPosition.jobLevelId === '') ||
      (!$scope.newPosition.departmentId || $scope.newPosition.departmentId === '');
  };

  var validatePositionUpdateObjectChange = function () {
    var keys = Object.keys($scope.oldPosition);
    for (var x = 0; x < keys.length; x++) {
      if ($scope.oldPosition.hasOwnProperty(keys[x])) {
        if ($scope.oldPosition[keys[x]] !== $scope.newPosition[keys[x]]) {
          return false;
        }
      }
    }
    return true;
  };

  resetPosition();
  getCompanyPositions();
  clearPositionError();

  $scope.getPositionFormHeader = function () {
    return $scope.editPosition ? 'Edit Position' : 'Create New Position';
  };

  $scope.validatePositionCreate = function () {
    return newPositionObjectEmpty();
  };

  $scope.getDepartmentLevels = function () {
    var departmentLevels = [];
    for (var x = 0; x < $scope.jobLevels.length; x++) {
      if ($scope.jobLevels[x].departmentId === $scope.newPosition.departmentId) {
        departmentLevels.push($scope.jobLevels[x]);
      }
    }
    return departmentLevels;
  };

  $scope.getPositionJobLevel = function (position) {
    return isPresent($scope.jobLevels, position, function (element, data) {
      return element._id === data.jobLevelId;
    });
  };

  $scope.createPosition = function () {
    clearPositionError();
    StructureSvc.createPosition($scope.newPosition).success(function (data) {
      resetPosition();
      swal("Success", "Position created.", "success");
      getCompanyPositions();
    }).error(function (error) {
      if (error.message) {
        $scope.positionErrorOccur = true;
        $scope.positionError = error.message;
      } else {
        console.log('Error: ', error);
      }
    });
  };

  $scope.validatePositionUpdate = function () {
    return newPositionObjectEmpty() || validatePositionUpdateObjectChange();
  };

  $scope.triggerPositionEdit = function (position) {
    $scope.editPosition = true;
    angular.copy(position, $scope.oldPosition);
    angular.copy(position, $scope.newPosition);
  };

  $scope.resetPositionEdit = function () {
    resetPosition();
    $scope.editPosition = false;
    $scope.oldPosition = {};
  };

  $scope.updatePosition = function () {
    StructureSvc.editPosition($scope.newPosition).success(function (data) {
      swal("Success", "Position updated.", "success");
      getCompanyPositions();
      $scope.resetPositionEdit();
    }).error(function (error) {
      console.log(error);
    })
  };

  $scope.deletePosition = function (position) {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + position.title + ' position is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      StructureSvc.deletePosition(position._id, companyId).success(function (data) {
        swal('Deleted!', data.message, 'success');
        getCompanyPositions();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
      });
    });
  };

  /*
   * End of Position section
   * */





  /*
   *  Utility functions here
   * */

  $scope.changeView = function (tabValue) {
    $scope.inView = tabValue;
  };

  $scope.displayActiveStatus = function (status) {
    return status === 'Active';
  };

  $scope.getJobLevelDepartment = function (jobLevel) {
    return isPresent($scope.departments, jobLevel, function (element, data) {
      return element._id === data.departmentId;
    });
  };

  var isPresent = function (collection, data, compareFunction) {
    for (var x = 0; x < collection.length; x++) {
      if (compareFunction(collection[x], data)) {
        return collection[x];
      }
    }
    return undefined;
  };
  /*
  * End of Utility Functions
  * */



  /*
   *  jQuery Section
   * */

}]);