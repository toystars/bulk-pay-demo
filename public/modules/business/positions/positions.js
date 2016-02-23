
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

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getPositions = function (businessId) {
    $http.get('/api/positions/business/' + businessId).success(function (data) {
      $scope.positions = data;
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
      businessId: businessId
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

  $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
    triggerSelect();
  });


  $scope.createPosition = function () {
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

  $scope.getDivisions = function () {
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
    return divisions;
  };

  $scope.getDepartments = function () {
    var departments = [];
    for (var x = 0; x < $scope.departments.length; x++) {
      if ($scope.position.divisionId && $scope.position.divisionId !== '') {
        if ($scope.position.divisionId === $scope.departments[x].divisionId) {
          departments.push($scope.departments[x]);
        }
      } else {
        departments.push($scope.departments[x]);
      }
    }
    return departments;
  };

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

  $scope.getValidPositions = function () {
    var positions = [];
    for (var x = 0; x < $scope.positions.length; x++) {
      if ($scope.singlePosition._id && $scope.positions[x]._id !== $scope.singlePosition._id && $scope.positions[x].parentPositionId !== $scope.singlePosition._id) {
        positions.push($scope.positions[x]);
      }
    }
    return positions;
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
   * Single unit display
   * */
  $scope.singleView = false;
  $scope.editActive = false;
  $scope.singlePosition = {};
  $scope.oldPosition = {};
  $scope.histories = [];

  $scope.showPosition = function (position) {
    $scope.singleView = true;
    angular.copy(position, $scope.oldPosition);
    angular.copy(position, $scope.singlePosition);
    getHistories($scope.singlePosition._id);
  };

  $scope.edit = function () {
    $scope.editActive = true;
    angular.copy($scope.oldPosition, $scope.singlePosition);
  };

  $scope.cancel = function () {
    $scope.editActive = false;
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
  };

  $scope.updatePosition = function () {
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


  /*
   * jQuery
   * */
  var triggerSelect = function () {
    jQuery('#new-position-status').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#new-position-business-unit').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#new-position-division').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#new-position-department').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#new-position-parent-position').select2({
      minimumResultsForSearch: 0
    });
  };


}]);

