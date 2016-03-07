
bulkPay.controller('BusinessPayTypesCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.payType = {};
  $scope.payTypes = [];
  $scope.$parent.inView = 'Pay Types';
  var businessId = '';
  $scope.options = {
    placeholder: "Choose One"
  };
  $scope.statuses = ['Active', 'Inactive'];
  $scope.choices = ['Yes', 'No'];
  $scope.types = ['Wage', 'Benefit', 'Deduction'];
  $scope.derivatives = ['Fixed', 'Formula'];
  $scope.frequencies = ['Monthly', 'Quarterly', 'Bi-Annually', 'Annually'];

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getPayTypes = function (businessId) {
    $http.get('/api/paytypes/business/' + businessId).success(function (data) {
      $scope.payTypes = data;
    }).error(function (error) {
      console.log(error);
    })
  };

  var resetPayType = function () {
    $scope.payType = {
      businessId: businessId
    };
  };



  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getPayTypes(businessId);
    resetPayType();
  });

  $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
    triggerSelect();
  });


  $scope.createPayType = function () {
    $http.post('/api/paytypes/', $scope.payType).success(function (data) {
      $scope.payTypes.push(data);
      jQuery('#new-pay-type-close').click();
      resetPayType();
      swal('Success', ' Pay Type created.', 'success');
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };



  /*
   * Helpers
   * */

  var removeFromCollection = function (id) {
    for (var x = 0; x < $scope.payTypes.length; x++) {
      if ($scope.payTypes[x]._id === id) {
        $scope.payTypes.splice(x, 1);
      }
    }
  };

  var replace = function (data) {
    for (var x = 0; x < $scope.payTypes.length; x++) {
      if ($scope.payTypes[x]._id === data._id) {
        $scope.payTypes[x] = data;
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

  $scope.showPayType = function (payType) {
    $scope.singleView = true;
    $scope.singlePayType = {};
    $scope.oldPayType = {};
    angular.copy(payType, $scope.oldPayType);
    angular.copy(payType, $scope.singlePayType);
    getHistories($scope.singlePayType._id);
  };

  $scope.delete = function () {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + $scope.singlePayType.title + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/payTypes/' + $scope.singlePayType._id).success(function (data) {
        swal('Deleted!', $scope.singlePayType.title + ' pay type deleted.', 'success');
        removeFromCollection($scope.singlePayType._id);
        $scope.closePayType();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
        console.log(error);
      });
    });
  };

  $scope.closePayType = function () {
    $scope.singlePayType = {};
    $scope.singleView = false;
    $scope.histories = [];
  };

  $scope.updatePayType = function () {
    $http.put('/api/paytypes/' + $scope.singlePayType._id, $scope.singlePayType).success(function (data) {
      getHistories(data._id);
      replace(data);
      swal("Success", "Pay type updated.", "success");
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

