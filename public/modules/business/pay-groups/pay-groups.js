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
  $scope.options = {
    placeholder: "Choose One"
  };
  $scope.statuses = ['Active', 'Inactive'];
  $scope.dataFetched = false;
  $scope.pensions = [];
  $scope.taxes = [];

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getPayGroups = function (businessId) {
    $http.get('/api/paygroups/business/' + businessId).success(function (data) {
      $scope.payGroups = data;
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
    })
  };

  var getTaxes = function (businessId) {
    $http.get('/api/taxes/business/' + businessId).success(function (data) {
      $scope.taxes = data;
    }).error(function (error) {
      AuthSvc.handleError(error);
    })
  };

  var getPensions = function (businessId) {
    $http.get('/api/pensions/business/' + businessId).success(function (data) {
      $scope.pensions = data;
    }).error(function (error) {
      AuthSvc.handleError(error);
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
    getTaxes(businessId);
    getPensions(businessId);
    resetPayGroup();
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
      replace(data);
      $scope.showPayGroup(data);
      swal("Success", "Pay group updated.", "success");
    }).error(function (error) {
      console.log(error);
    });
  };

  $scope.getTaxRuleDisplayName = function (tax) {
    return tax.code + ' - ' + tax.name;
  };

  $scope.getPensionRuleDisplayName = function (pension) {
    return pension.name;
  };

  $scope.getPensionName = function (id) {
    var pensionName;
    var pension = _.find($scope.pensions, function (pension) {
      return pension._id === id;
    });
    if (pension) {
      pensionName = pension.code + ' - ' + pension.name;
    } else {
      pensionName = 'No pension rule defined.';
    }
    return pensionName;
  };

  $scope.getTaxName = function (taxId) {
    var tax = _.find($scope.taxes, function (tax) {
      return tax._id === taxId;
    });
    if (tax) {
      return tax.code + ' - ' + tax.name;
    } else {
      return 'No tax rule defined.';
    }
  }


}]);

