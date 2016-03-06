
bulkPay.controller('BusinessUnitsCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.unit = {};
  $scope.businessUnits = [];
  $scope.$parent.inView = 'Business Units';
  var businessId = '';

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

  /*
  * Event Listeners
  * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getBusinessUnits(businessId);
  });

  $scope.createBusinessUnit = function () {
    var requestObject = {
      name: $scope.unit.name,
      parentId: $scope.unit.parentId,
      location: $scope.unit.location,
      parentName: getParentName($scope.unit.parentId),
      businessId: businessId
    };
    $http.post('/api/businessunits/', requestObject).success(function (data) {
      $scope.businessUnits.push(data);
      jQuery('#new-unit-close').click();
      $scope.unit = {};
      swal("Success", "Business Unit created.", "success");
    }).error(function (error) {
      console.log(error);
    });
  };

  $scope.options = {
    placeholder: "Choose One"
  };


  /*
   * Data
   * */
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
    for (var x = 0; x < $scope.businessUnits.length; x++) {
      if ($scope.businessUnits[x]._id === parentId) {
        return $scope.businessUnits[x].name;
      }
    }
    return '';
  };

  var removeFromCollection = function (id) {
    for (var x = 0; x < $scope.businessUnits.length; x++) {
      if ($scope.businessUnits[x]._id === id) {
        $scope.businessUnits.splice(x, 1);
      }
    }
  };

  var replace = function (data) {
    for (var x = 0; x < $scope.businessUnits.length; x++) {
      if ($scope.businessUnits[x]._id === data._id) {
        $scope.businessUnits[x] = data;
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

  $scope.showUnit = function (unit) {
    $scope.singleView = true;
    $scope.singleUnit = {};
    $scope.oldUnit = {};
    angular.copy(unit, $scope.oldUnit);
    angular.copy(unit, $scope.singleUnit);
    getHistories($scope.singleUnit._id);
  };

  $scope.delete = function () {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + $scope.singleUnit.name + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/businessunits/' + $scope.singleUnit._id).success(function (data) {
        swal('Deleted!', $scope.singleUnit.name + ' business unit deleted.', 'success');
        removeFromCollection($scope.singleUnit._id);
        $scope.closeUnit();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
        console.log(error);
      });
    });
  };

  $scope.closeUnit = function () {
    $scope.singleUnit = {};
    $scope.singleView = false;
    $scope.histories = [];
  };

  $scope.updateBusinessUnit = function () {
    $scope.singleUnit.parentName = getParentName($scope.singleUnit.parentId);
    $http.put('/api/businessunits/' + $scope.singleUnit._id, $scope.singleUnit).success(function (data) {
      getHistories(data._id);
      replace(data);
      swal("Success", "Business Unit updated.", "success");
    }).error(function (error) {
      console.log(error);
    });
  };

  $scope.getValidUnits = function () {
    var units = [];
    for (var x = 0; x < $scope.businessUnits.length; x++) {
      if ($scope.businessUnits[x]._id !== $scope.oldUnit._id) {
        if ($scope.businessUnits[x].parentId !== $scope.oldUnit._id) {
          units.push($scope.businessUnits[x]);
        }
      }
    }
    return units;
  };

}]);








