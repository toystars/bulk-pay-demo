
bulkPay.controller('BusinessDivisionsCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.division = {};
  $scope.businessUnits = [];
  $scope.divisions = [];
  $scope.$parent.inView = 'Divisions';
  var businessId = '';
  $scope.dataFetched = false;

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

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
    getBusinessUnits(businessId);
    getBusinessDivisions(businessId);
  });

  $scope.options = {
    placeholder: "Choose One"
  };


  $scope.createDivision = function () {
    var requestObject = {
      name: $scope.division.name,
      isParent: $scope.division.isParent,
      location: $scope.division.location,
      businessUnitId: ($scope.division.isParent) ? $scope.division.businessUnitId : '',
      businessUnitName: ($scope.division.isParent) ? getBusinessUnitName($scope.division.businessUnitId) : '',
      businessId: businessId,
      parentId: (!$scope.division.isParent) ? $scope.division.parentId : '',
      parentName: (!$scope.division.isParent) ? getParentName($scope.division.parentId) : ''
    };
    $http.post('/api/divisions/', requestObject).success(function (data) {
      $scope.divisions.push(data);
      jQuery('#new-division-close').click();
      $scope.division = {};
      $scope.isParent = true;
      swal("Success", "Division created.", "success");
    }).error(function (error) {
      console.log(error);
    });
  };


  /*
   * Data
   * */
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
    for (var x = 0; x < $scope.divisions.length; x++) {
      if ($scope.divisions[x]._id === parentId) {
        return $scope.divisions[x].name;
      }
    }
    return '';
  };

  var getBusinessUnitName = function (id) {
    for (var x = 0; x < $scope.businessUnits.length; x++) {
      if ($scope.businessUnits[x]._id === id) {
        return $scope.businessUnits[x].name;
      }
    }
    return '';
  };

  var removeFromCollection = function (id) {
    for (var x = 0; x < $scope.divisions.length; x++) {
      if ($scope.divisions[x]._id === id) {
        $scope.divisions.splice(x, 1);
      }
    }
  };

  var replace = function (data) {
    for (var x = 0; x < $scope.divisions.length; x++) {
      if ($scope.divisions[x]._id === data._id) {
        $scope.divisions[x] = data;
      }
    }
  };

  $scope.getLastHistory = function () {
    return $scope.histories[$scope.histories.length - 1];
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
  $scope.histories = [];
  $scope.filteredDivisions = [];

  $scope.showDivision = function (division) {
    $scope.singleView = true;
    $scope.singleDivision = {};
    $scope.oldDivision = {};
    angular.copy(division, $scope.oldDivision);
    angular.copy(division, $scope.singleDivision);
    getHistories($scope.singleDivision._id);
    setParentsDivisions();
  };

  $scope.delete = function () {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + $scope.singleDivision.name + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/divisions/' + $scope.singleDivision._id).success(function (data) {
        swal('Deleted!', $scope.singleDivision.name + ' division deleted.', 'success');
        removeFromCollection($scope.singleDivision._id);
        $scope.closeDivision();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
        console.log(error);
      });
    });
  };

  $scope.closeDivision = function () {
    $scope.singleDivision = {};
    $scope.singleView = false;
    $scope.histories = [];
  };

  $scope.updateDivision = function () {

    $scope.singleDivision.businessUnitId = ($scope.singleDivision.isParent) ? $scope.singleDivision.businessUnitId : '';
    $scope.singleDivision.businessUnitName = ($scope.singleDivision.isParent) ? getBusinessUnitName($scope.singleDivision.businessUnitId) : '';
    $scope.singleDivision.parentId = (!$scope.singleDivision.isParent) ? $scope.singleDivision.parentId : '';
    $scope.singleDivision.parentName = (!$scope.singleDivision.isParent) ? getParentName($scope.singleDivision.parentId) : '';

    $http.put('/api/divisions/' + $scope.singleDivision._id, $scope.singleDivision).success(function (data) {
      getHistories(data._id);
      replace(data);
      swal("Success", "Division updated.", "success");
    }).error(function (error) {
      console.log(error);
    });
  };

  var setParentsDivisions = function () {
    var divisions = [];
    for (var x = 0; x < $scope.divisions.length; x++) {

      if ((!$scope.singleDivision.parentId || $scope.singleDivision.parentId === '') && $scope.divisions[x]._id !== $scope.singleDivision._id && $scope.divisions[x].parentId !== $scope.singleDivision._id) {
        divisions.push($scope.divisions[x]);
      } else if ($scope.divisions[x]._id !== $scope.singleDivision._id && $scope.divisions[x].parentId !== $scope.singleDivision._id) {
        divisions.push($scope.divisions[x]);
      }
    }
    $scope.filteredDivisions = divisions;
  };


}]);

