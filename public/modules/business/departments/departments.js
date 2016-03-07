
bulkPay.controller('BusinessDepartmentsCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.department = {};
  $scope.departments = [];
  $scope.divisions = [];
  $scope.$parent.inView = 'Departments';
  var businessId = '';
  $scope.options = {
    placeholder: "Choose One"
  };

  var resetDepartment = function () {
    $scope.department = {
      isGeneric: 'No',
      isParent: 'Yes',
      divisionsServed: [],
      parentId: '',
      divisionId: ''
    };
  };

  /*
   * Reset department object on controller load
   * */
  resetDepartment();


  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getBusinessDivisions = function (businessId) {
    $http.get('/api/divisions/business/' + businessId).success(function (data) {
      $scope.divisions = data;
      $scope.divisions.unshift({
        name: 'All',
        _id: 'All'
      });
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

  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getDepartments(businessId);
    getBusinessDivisions(businessId);
  });


  $scope.createDepartment = function () {

    var requestObject = {
      name: $scope.department.name,
      businessId: businessId,
      isParent: $scope.department.isParent,
      isGeneric: $scope.department.isGeneric,
      location: $scope.department.location,
      divisionsServed: $scope.department.divisionsServed,
      divisionId: $scope.department.divisionId,
      divisionName: (!$scope.department.divisionId || $scope.department.divisionId === '') ? '' : getDivisionName($scope.department.divisionId),
      parentId: $scope.department.parentId,
      parentName: (!$scope.department.parentId || $scope.department.parentId === '') ? '' : getParentName($scope.department.parentId)
    };
    requestObject.divisionId = (requestObject.isParent === 'Yes') ? requestObject.divisionId : '';
    requestObject.divisionName = (requestObject.isParent === 'Yes') ? requestObject.divisionName : '';

    if (requestObject.isGeneric === 'Yes') {
      requestObject.isParent = 'Yes';
      requestObject.divisionId = '';
      requestObject.divisionName = '';
      requestObject.parentId = '';
      requestObject.parentName = '';
    } else {
      requestObject.divisionsServed = [];
    }

    $http.post('/api/departments/', requestObject).success(function (data) {
      $scope.departments.push(data);
      resetDepartment();
      jQuery('#new-division-close').click();
      swal("Success", "Department created.", "success");
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };


  /*
   * Data
   * */
  $scope.choices = ['Yes', 'No'];
  $scope.statuses = ['Active', 'Inactive'];

  $scope.states = ['Abia State',
    'Adamawa State',
    'Akwa Ibom State',
    'Anambra State',
    'Bauchi State',
    'Bayelsa State',
    'Benue State',
    'Borno State',
    'Cross River State',
    'Delta State',
    'Ebonyi State',
    'Edo State',
    'Ekiti State',
    'Enugu State',
    'Federal Capital Territory',
    'Gombe State',
    'Imo State',
    'Jigawa State',
    'Kaduna State',
    'Kano State',
    'Katsina State',
    'Kebbi State',
    'Kogi State',
    'Kwara State',
    'Lagos State',
    'Nasarawa State',
    'Niger State',
    'Ogun State',
    'Ondo State',
    'Osun State',
    'Oyo State',
    'Plateau State',
    'Rivers State',
    'Sokoto State',
    'Taraba State',
    'Yobe State',
    'Zamfara State'
  ];

  /*
   * Helpers
   * */
  var getParentName = function (parentId) {
    for (var x = 0; x < $scope.departments.length; x++) {
      if ($scope.departments[x]._id === parentId) {
        return $scope.departments[x].name;
      }
    }
    return '';
  };

  var getDivisionName = function (id) {
    for (var x = 0; x < $scope.divisions.length; x++) {
      if ($scope.divisions[x]._id === id) {
        return $scope.divisions[x].name;
      }
    }
    return '';
  };

  var replace = function (data) {
    for (var x = 0; x < $scope.departments.length; x++) {
      if ($scope.departments[x]._id === data._id) {
        $scope.departments[x] = data;
      }
    }
  };

  var removeFromCollection = function (id) {
    for (var x = 0; x < $scope.departments.length; x++) {
      if ($scope.departments[x]._id === id) {
        $scope.departments.splice(x, 1);
      }
    }
  };

  var getHistories = function (objectId) {
    $http.get('/api/histories/object/' + objectId).success(function (data) {
      $scope.histories = data;
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };


  /*
   * Single unit display
   * */
  $scope.singleView = false;
  $scope.filteredDepartments = [];

  $scope.showDepartment = function (department) {
    $scope.singleView = true;
    $scope.singleDepartment = {};
    $scope.oldDepartment = {};
    angular.copy(department, $scope.oldDepartment);
    angular.copy(department, $scope.singleDepartment);
    getHistories($scope.singleDepartment._id);
    setParentsDepartments();
  };

  $scope.delete = function () {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + $scope.singleDepartment.name + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/departments/' + $scope.singleDepartment._id).success(function (data) {
        swal('Deleted!', $scope.singleDepartment.name + ' department deleted.', 'success');
        removeFromCollection($scope.singleDepartment._id);
        $scope.closeDivision();
      }).error(function (error) {
        AuthSvc.handleError(error);
        swal('Error Occurred', error.message, 'warning');
      });
    });
  };

  $scope.closeDivision = function () {
    $scope.singleDepartment = {};
    $scope.singleView = false;
    $scope.histories = [];
  };

  $scope.updateDepartment = function () {

    $scope.singleDepartment.divisionName = (!$scope.singleDepartment.divisionId || $scope.singleDepartment.divisionId === '') ? '' : getDivisionName($scope.singleDepartment.divisionId);
    $scope.singleDepartment.parentName = (!$scope.singleDepartment.parentId || $scope.singleDepartment.parentId === '') ? '' : getParentName($scope.singleDepartment.parentId);
    $scope.singleDepartment.divisionId = ($scope.singleDepartment.isParent === 'Yes') ? $scope.singleDepartment.divisionId : '';
    $scope.singleDepartment.divisionName = ($scope.singleDepartment.isParent === 'Yes') ? $scope.singleDepartment.divisionName : '';
    if ($scope.singleDepartment.isGeneric === 'Yes') {
      $scope.singleDepartment.isParent = 'Yes';
      $scope.singleDepartment.divisionId = '';
      $scope.singleDepartment.divisionName = '';
      $scope.singleDepartment.parentId = '';
      $scope.singleDepartment.parentName = '';
    } else {
      $scope.singleDepartment.divisionsServed = [];
    }

    $http.put('/api/departments/' + $scope.singleDepartment._id, $scope.singleDepartment).success(function (data) {
      getHistories(data._id);
      replace(data);
      swal("Success", "Department updated.", "success");
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };

  var setParentsDepartments = function () {
    var departments = [];
    for (var x = 0; x < $scope.departments.length; x++) {
      if ((!$scope.singleDepartment.parentId || $scope.singleDepartment.parentId === '') && $scope.departments[x]._id !== $scope.singleDepartment._id && $scope.departments[x].parentId !== $scope.singleDepartment._id) {
        departments.push($scope.departments[x]);
      } else if ($scope.departments[x]._id !== $scope.singleDepartment._id && $scope.departments[x].parentId !== $scope.singleDepartment._id) {
        departments.push($scope.departments[x]);
      }
    }
    $scope.filteredDepartments = departments;
  };

  $scope.getDivisions = function (singleDepartment) {
    if (singleDepartment.divisionsServed.length === 0) {
      return singleDepartment.divisionName;
    } else if (singleDepartment.divisionsServed.length === 1 && singleDepartment.divisionsServed[0] === 'All') {
      return 'All divisions';
    }
    var division = singleDepartment.divisionsServed.length === 1 ? ' division' : ' divisions';
    return singleDepartment.divisionsServed.length + division;
  };


}]);

