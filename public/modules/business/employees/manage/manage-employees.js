bulkPay.controller('BusinessEmployeesManagerCtrl', ['$scope', '$rootScope', '$timeout', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, $timeout, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.$parent.inView = 'Manage Employees';
  $scope.message = '';
  $scope.options = {
    placeholder: "Choose One",
    allowClear: true
  };
  $scope.nameFilter = {
    name: ''
  };
  $scope.dataFetched = false;
  $scope.filter = {};
  $scope.currentPage = 1;
  $scope.pageSize = 25;

  var businessId = '';
  $scope.employees = [];
  $scope.businessUnits = [];
  $scope.divisions = [];
  $scope.departments = [];
  $scope.positions = [];

  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getBusinessEmployees(businessId);
    getBusinessUnits(businessId);
    getBusinessDivisions(businessId);
    getDepartments(businessId);
    getPositions(businessId);
  });


  $scope.changeView = function (view) {
    $scope.inView = view;
  };

  var getBusinessEmployees = function (businessId) {
    $scope.dataFetched = false;
    var requestObject = {};
    var keys = Object.keys($scope.filter);
    for (var x = 0; x < keys.length; x++) {
      if ($scope.filter.hasOwnProperty(keys[x])) {
        if ($scope.filter[keys[x]] && $scope.filter[keys[x]] !== '') {
          requestObject[keys[x]] = $scope.filter[keys[x]];
        }
      }
    }
    $http.post('/api/employees/business/' + businessId + '/filtered', requestObject).success(function (data) {
      $scope.employees = data;
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };

  var getBusinessUnits = function (businessId) {
    $http.get('/api/businessunits/business/' + businessId).success(function (data) {
      $scope.businessUnits = data;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };

  var getBusinessDivisions = function (businessId) {
    $http.get('/api/divisions/business/' + businessId).success(function (data) {
      $scope.divisions = data;
      $scope.filteredDivisions = data;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };

  var getDepartments = function (businessId) {
    $http.get('/api/departments/business/' + businessId).success(function (data) {
      $scope.departments = data;
      $scope.filteredDepartments = data;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };

  var getPositions = function (businessId) {
    $http.get('/api/positions/business/' + businessId).success(function (data) {
      $scope.positions = data;
      $scope.filteredPositions = data;
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
    getBusinessEmployees(businessId);
    getBusinessUnits(businessId);
    getBusinessDivisions(businessId);
    getDepartments(businessId);
    getPositions(businessId);
  }


  /*
   * Getters
   * */
  $scope.getBusinessUnit = function (id) {
    return _.find($scope.businessUnits, function (businessUnit) {
      return businessUnit._id === id;
    });
  };

  $scope.getDivision = function (id) {
    return _.find($scope.divisions, function (division) {
      return division._id === id;
    });
  };

  $scope.getDepartment = function (id) {
    return _.find($scope.departments, function (department) {
      return department._id === id;
    });
  };

  $scope.getPosition = function (id) {
    return _.find($scope.positions, function (position) {
      return position._id === id;
    });
  };


  /*
   * Helpers
   * */
  $scope.resetFilters = function () {
    $scope.filter = {};
  };

  $scope.alterFilter = function () {
    getBusinessEmployees(businessId);
  };


}]);

