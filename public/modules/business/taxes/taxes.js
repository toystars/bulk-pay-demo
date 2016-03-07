
bulkPay.controller('BusinessTaxesCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', 'toastr', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state, toastr) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.tax = {};
  $scope.taxes = [];
  $scope.$parent.inView = 'Taxes';
  var businessId = '';
  $scope.payTypeSortConfig = {
    group: 'foobar',
    animation: 150,
    onSort: function (evt) {
      //compileForm();
    }
  };
  $scope.options = {
    placeholder: "Choose One"
  };
  $scope.statuses = ['Active', 'Inactive'];
  $scope.ranges = [];

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getTaxes = function (businessId) {
    $http.get('/api/taxes/business/' + businessId).success(function (data) {
      $scope.taxes = data;
    }).error(function (error) {
      AuthSvc.handleError(error);
    })
  };

  var resetTax = function () {
    $scope.tax = {
      businessId: businessId,
      code: '',
      name: '',
      rules: []
    };
  };


  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getTaxes(businessId);
    resetTax();
  });

  $scope.createTax = function () {
    $http.post('/api/taxes/', $scope.tax).success(function (data) {
      $scope.taxes.push(data);
      jQuery('#new-tax-close').click();
      resetTax();
      swal('Success', 'Tax created.', 'success');
    }).error(function (error) {
      console.log(error);
    });
  };



  /*
   * Helpers
   * */

  var removeFromCollection = function (id) {
    for (var x = 0; x < $scope.taxes.length; x++) {
      if ($scope.taxes[x]._id === id) {
        $scope.taxes.splice(x, 1);
      }
    }
  };

  var replace = function (data) {
    for (var x = 0; x < $scope.taxes.length; x++) {
      if ($scope.taxes[x]._id === data._id) {
        $scope.taxes[x] = data;
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

  $scope.setRange = function () {
    var ranges = ['FIRST', 'NEXT', 'OVER'];
    if ($scope.singleTax) {
      if (_.find($scope.singleTax.rules, function (rule) { return rule.range === 'FIRST' })) {
        ranges.splice(ranges.indexOf('FIRST'), 1);
      }
      if (_.find($scope.singleTax.rules, function (rule) { return rule.range === 'OVER' })) {
        ranges.splice(ranges.indexOf('OVER'), 1);
      }
    }
    $scope.ranges = ranges;
  };

  $scope.removeRule = function (index) {
    swal({
      title: 'Are you sure?',
      text: 'Deleting rule is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: true
    }, function () {
      $scope.singleTax.rules.splice(index, 1);
      toastr.success('Rule deleted!');
    });
  };


  /*
   * Single unit display
   * */
  $scope.singleView = false;
  $scope.histories = [];
  $scope.taxRule = {};

  $scope.showTax = function (tax) {
    $scope.singleView = true;
    $scope.singleTax = {};
    $scope.oldTax = {};
    angular.copy(tax, $scope.singleTax);
    angular.copy(tax, $scope.oldTax);
    getHistories($scope.singleTax._id);
  };

  $scope.addRule = function () {
    $scope.singleTax.rules.push($scope.taxRule);
    jQuery('#new-rule-close').click();
    $scope.taxRule = {};
  };

  $scope.delete = function () {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + $scope.singleTax.name + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/taxes/' + $scope.singleTax._id).success(function (data) {
        swal('Deleted!', $scope.singleTax.name + ' tax deleted.', 'success');
        removeFromCollection($scope.singleTax._id);
        $scope.closeTax();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
        AuthSvc.handleError(error);
      });
    });
  };

  $scope.closeTax = function () {
    $scope.singleTax = {};
    $scope.singleView = false;
    $scope.histories = [];
  };

  $scope.updateTax = function () {
    $http.put('/api/taxes/' + $scope.singleTax._id, $scope.singleTax).success(function (data) {
      getHistories(data._id);
      replace(data);
      swal("Success", "Tax updated.", "success");
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };


}]);

