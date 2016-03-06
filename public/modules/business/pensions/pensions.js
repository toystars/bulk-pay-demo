
bulkPay.controller('BusinessPensionsCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', 'toastr', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state, toastr) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.pension = {};
  $scope.pensions = [];
  $scope.payTypes = [];
  $scope.$parent.inView = 'Pensions';
  var businessId = '';
  $scope.inView = 'Pension Rules';

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getPensions = function (businessId) {
    $http.get('/api/pensions/business/' + businessId).success(function (data) {
      $scope.pensions = data;
    }).error(function (error) {
      AuthSvc.handleError(error);
    })
  };

  var getPayTypes = function (businessId) {
    $http.get('/api/paytypes/business/' + businessId).success(function (data) {
      $scope.payTypes = data;
    }).error(function (error) {
      console.log(error);
    })
  };

  var resetPension = function () {
    $scope.pension = {
      businessId: businessId,
      code: '',
      name: '',
      payTypes: [],
      employerContributionRate: 0,
      employeeContributionRate: 0
    };
  };


  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getPensions(businessId);
    getPayTypes(businessId);
    resetPension();
  });

  $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
    triggerSelect();
  });


  $scope.createPension = function () {
    $http.post('/api/pensions/', $scope.pension).success(function (data) {
      $scope.pensions.push(data);
      jQuery('#new-pension-close').click();
      resetPension();
      swal('Success', 'Pension created.', 'success');
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };

  $scope.changeView = function (view) {
    $scope.inView = view;
  };



  /*
   * Helpers
   * */

  var removeFromPensions = function (id) {
    for (var x = 0; x < $scope.pensions.length; x++) {
      if ($scope.pensions[x]._id === id) {
        $scope.pensions.splice(x, 1);
      }
    }
  };

  var replaceInPensions = function (data) {
    for (var x = 0; x < $scope.pensions.length; x++) {
      if ($scope.pensions[x]._id === data._id) {
        $scope.pensions[x] = data;
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
   * Single pension display
   * */
  $scope.singlePensionView = false;
  $scope.histories = [];

  $scope.showPension = function (pension) {
    $scope.singlePensionView = true;
    $scope.singlePension = {};
    $scope.oldPension = {};
    angular.copy(pension, $scope.singlePension);
    angular.copy(pension, $scope.oldPension);
    getHistories($scope.singlePension._id);
  };

  $scope.deletePension = function () {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + $scope.singlePension.name + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/pensions/' + $scope.singlePension._id).success(function (data) {
        swal('Deleted!', $scope.singlePension.name + ' tax deleted.', 'success');
        removeFromPensions($scope.singlePension._id);
        $scope.closeTax();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
        AuthSvc.handleError(error);
      });
    });
  };

  $scope.closePension = function () {
    $scope.singlePension = {};
    $scope.oldPension = {};
    $scope.singlePensionView = false;
    $scope.histories = [];
  };

  $scope.updatePension = function () {
    $http.put('/api/pensions/' + $scope.singlePension._id, $scope.singlePension).success(function (data) {
      getHistories(data._id);
      replaceInPensions(data);
      swal("Success", 'Pension updated.", "success');
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };

  $scope.statuses = ['Active', 'Inactive'];

  /*
   * jQuery
   * */
  var triggerSelect = function () {
    jQuery('#pension-rule-types').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#pension-rule-status').select2({
      minimumResultsForSearch: 0
    });
  };


}]);

