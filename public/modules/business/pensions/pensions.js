
bulkPay.controller('BusinessPensionsCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', 'toastr', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state, toastr) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.pension = {};
  $scope.pensionManager = {};
  $scope.pensions = [];
  $scope.pensionManagers = [];
  $scope.payTypes = [];
  $scope.$parent.inView = 'Pensions';
  var businessId = '';
  $scope.inView = 'Pension Rules';
  $scope.histories = [];
  $scope.pensionManagerHistories = [];
  $scope.dataFetched = false;

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getPensions = function (businessId) {
    $http.get('/api/pensions/business/' + businessId).success(function (data) {
      $scope.pensions = data;
      $scope.dataFetched = true;
    }).error(function (error) {
      AuthSvc.handleError(error);
    })
  };

  var getPensionManagers = function (businessId) {
    $http.get('/api/pensionmanagers/business/' + businessId).success(function (data) {
      $scope.pensionManagers = data;
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

  var resetPensionManager = function () {
    $scope.pensionManager = {
      businessId: businessId,
      code: '',
      name: '',
      status: 'Active'
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
    getPensionManagers(businessId);
    resetPension();
    resetPensionManager();
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

  $scope.createPensionManager = function () {
    $http.post('/api/pensionmanagers/', $scope.pensionManager).success(function (data) {
      $scope.pensionManagers.push(data);
      jQuery('#new-pension-manager-close').click();
      resetPensionManager();
      swal('Success', 'Pension Manager created.', 'success');
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

  var removeFromPensionManagers = function (id) {
    for (var x = 0; x < $scope.pensionManagers.length; x++) {
      if ($scope.pensionManagers[x]._id === id) {
        $scope.pensionManagers.splice(x, 1);
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

  var replaceInPensionManagers = function (data) {
    for (var x = 0; x < $scope.pensionManagers.length; x++) {
      if ($scope.pensionManagers[x]._id === data._id) {
        $scope.pensionManagers[x] = data;
      }
    }
  };

  $scope.getLastHistory = function () {
    return $scope.histories[$scope.histories.length - 1];
  };

  $scope.getLastPensionManagerHistory = function () {
    return $scope.pensionManagerHistories[$scope.pensionManagerHistories.length - 1];
  };

  var getHistories = function (objectId) {
    $http.get('/api/histories/object/' + objectId).success(function (data) {
      $scope.histories = data;
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };

  var getPensionManagerHistories = function (objectId) {
    $http.get('/api/histories/object/' + objectId).success(function (data) {
      $scope.pensionManagerHistories = data;
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };



  /*
   * Single pension display
   * */
  $scope.singlePensionView = false;

  $scope.showPension = function (pension) {
    $scope.singlePensionView = true;
    $scope.singlePension = {};
    $scope.oldPension = {};
    $scope.histories = [];
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
        $scope.closePension();
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
      swal("Success", 'Pension updated.', 'success');
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };










  /*
   * Single pension manager display
   * */
  $scope.singlePensionManagerView = false;

  $scope.showPensionManager = function (pensionManager) {
    $scope.singlePensionManagerView = true;
    $scope.singlePensionManager = {};
    $scope.oldPensionManager = {};
    $scope.pensionManagerHistories = [];
    angular.copy(pensionManager, $scope.singlePensionManager);
    angular.copy(pensionManager, $scope.oldPensionManager);
    getPensionManagerHistories($scope.singlePensionManager._id);
  };

  $scope.deletePensionManager = function () {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + $scope.singlePensionManager.name + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/pensionmanagers/' + $scope.singlePensionManager._id).success(function (data) {
        swal('Deleted!', $scope.singlePensionManager.name + ' tax deleted.', 'success');
        removeFromPensionManagers($scope.singlePensionManager._id);
        $scope.closePensionManager();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
        AuthSvc.handleError(error);
      });
    });
  };

  $scope.closePensionManager = function () {
    $scope.singlePensionManager = {};
    $scope.oldPensionManager = {};
    $scope.singlePensionManagerView = false;
    $scope.pensionManagerHistories = [];
  };

  $scope.updatePensionManager = function () {
    $http.put('/api/pensionmanagers/' + $scope.singlePensionManager._id, $scope.singlePensionManager).success(function (data) {
      getPensionManagerHistories(data._id);
      replaceInPensionManagers(data);
      swal("Success", 'Pension Manager updated.', 'success');
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };

  $scope.statuses = ['Active', 'Inactive'];


}]);

