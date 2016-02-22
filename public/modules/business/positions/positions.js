
bulkPay.controller('BusinessPositionsCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.position = {};
  $scope.positions = [];
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
    getPositions(businessId);
    resetPosition();
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

  $scope.showPosition = function (position) {
    $scope.singleView = true;
    $scope.singlePosition = {};
    $scope.oldPosition = {};
    angular.copy(position, $scope.oldPosition);
    angular.copy(position, $scope.singlePosition);
    getHistories($scope.singlePosition._id);
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
    $scope.histories = [];
  };

  $scope.updatePosition = function () {
    $http.put('/api/positions/' + $scope.singlePosition._id, $scope.singlePosition).success(function (data) {
      getHistories(data._id);
      replace(data);
      swal("Success", "Position updated.", "success");
    }).error(function (error) {
      console.log(error);
    });
  };

  $scope.statuses = ['Active', 'Inactive'];


  /*
   * jQuery
   * */
  var triggerSelect = function () {
    jQuery('#update-position-status').select2({
      minimumResultsForSearch: 0
    });
  };


}]);

