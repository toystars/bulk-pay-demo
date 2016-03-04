
bulkPay.controller('BusinessPayGroupsCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.payGroup = {};
  $scope.payGroups = [];
  $scope.$parent.inView = 'Pay Groups';
  var businessId = '';

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getPayGroups = function (businessId) {
    $http.get('/api/paygroups/business/' + businessId).success(function (data) {
      $scope.payGroups = data;
    }).error(function (error) {
      console.log(error);
    })
  };

  var resetPayGroup = function () {
    $scope.payGroup = {
      businessId: businessId
    };
  };



  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getPayGroups(businessId);
    resetPayGroup();
  });

  $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
    triggerSelect();
  });


  $scope.createPayGroup = function () {
    $http.post('/api/paygroups/', $scope.payGroup).success(function (data) {
      $scope.payGroups.push(data);
      jQuery('#new-pay-group-close').click();
      resetPayGroup();
      swal('Success', ' Pay Group created.', 'success');
    }).error(function (error) {
      console.log(error);
    });
  };



  /*
   * Helpers
   * */

  var removeFromCollection = function (id) {
    for (var x = 0; x < $scope.payGroups.length; x++) {
      if ($scope.payGroups[x]._id === id) {
        $scope.payGroups.splice(x, 1);
      }
    }
  };

  var replace = function (data) {
    for (var x = 0; x < $scope.payGroups.length; x++) {
      if ($scope.payGroups[x]._id === data._id) {
        $scope.payGroups[x] = data;
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

  $scope.showPayGroup = function (payGroup) {
    $scope.singleView = true;
    $scope.singlePayGroup = {};
    $scope.oldPayGroup = {};
    angular.copy(payGroup, $scope.oldPayGroup);
    angular.copy(payGroup, $scope.singlePayGroup);
    getHistories($scope.singlePayGroup._id);
  };

  $scope.delete = function () {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + $scope.singlePayGroup.name + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/paygroups/' + $scope.singlePayGroup._id).success(function (data) {
        swal('Deleted!', $scope.singlePayGroup.title + ' pay group deleted.', 'success');
        removeFromCollection($scope.singlePayGroup._id);
        $scope.closePayGroup();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
        console.log(error);
      });
    });
  };

  $scope.closePayGroup = function () {
    $scope.singlePayGroup = {};
    $scope.singleView = false;
    $scope.histories = [];
  };

  $scope.updatePayGroup = function () {
    $http.put('/api/paygroups/' + $scope.singlePayGroup._id, $scope.singlePayGroup).success(function (data) {
      getHistories(data._id);
      replace(data);
      swal("Success", "Pay group updated.", "success");
    }).error(function (error) {
      console.log(error);
    });
  };


  /*
   * jQuery
   * */
  var triggerSelect = function () {
    jQuery('#update-position-status').select2({
      minimumResultsForSearch: 0
    });
  };


}]);

