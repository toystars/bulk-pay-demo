
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
  $scope.dataFetched = false;

  var resetDepartment = function () {
    $scope.department = {
      name: '',
      isParent: 'Yes',
      location: $scope.business.state,
      businessId: businessId,
      parent: '',
      division: ''
    };
  };


  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

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
      $scope.dataFetched = true;
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
    resetDepartment();
  });


  $scope.createDepartment = function () {
    if ($scope.department.isParent === 'Yes') {
      delete $scope.department.parent;
      $scope.department.divisionId = $scope.department.division;
    } else {
      delete $scope.department.division;
    }
    $http.post('/api/departments/', $scope.department).success(function (data) {
      $scope.departments.push(data);
      resetDepartment();
      jQuery('#new-department-close').click();
      swal("Success", "Department created.", "success");
    }).error(function (error) {
      console.log(error);
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
    $scope.singleDepartment.parentId = $scope.singleDepartment.parent ? $scope.singleDepartment.parent._id : '';
    $scope.singleDepartment.divisionId = $scope.singleDepartment.division ? $scope.singleDepartment.division._id : '';
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
    if ($scope.singleDepartment.isParent === 'Yes') {
      $scope.singleDepartment.parent = '';
      $scope.singleDepartment.division = $scope.singleDepartment.divisionId;
    } else {
      $scope.singleDepartment.division = '';
      $scope.singleDepartment.parent = $scope.singleDepartment.parentId;
    }
    $http.put('/api/departments/' + $scope.singleDepartment._id, $scope.singleDepartment).success(function (data) {
      getHistories(data._id);
      replace(data);
      swal("Success", "Department updated.", "success");
    }).error(function (error) {
      console.log(error);
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


}]);

