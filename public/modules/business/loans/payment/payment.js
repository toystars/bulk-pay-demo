bulkPay.controller('BusinessLoanPaymentRulesCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.paymentRule = {};
  $scope.paymentRules = [];
  $scope.$parent.inView = 'Payment Rules';
  var businessId = '';
  $scope.statuses = ['Active', 'Inactive'];
  var repaymentTypes = ['Monthly Fixed'];
  $scope.options = {
    placeholder: "Choose One"
  };

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getPaymentRules = function (businessId) {
    $http.get('/api/paymentrules/business/' + businessId).success(function (paymentRules) {
      $scope.paymentRules = paymentRules;
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    })
  };

  var resetPaymentRule = function () {
    $scope.paymentRule = {
      businessId: businessId,
      repaymentTypes: repaymentTypes
    };
  };


  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getPaymentRules(businessId);
    resetPaymentRule();
  });


  $scope.createPaymentRule = function () {
    $http.post('/api/paymentrules/', $scope.paymentRule).success(function (data) {
      $scope.paymentRules.push(data);
      jQuery('#new-payment-rule-close').click();
      resetPaymentRule();
      swal('Success', ' Payment Rule created.', 'success');
      $scope.showPaymentRule(data);
    }).error(function (error) {
      console.log(error);
    });
  };


  /*
  * Helpers
  * */

  var removeFromCollection = function (id) {
    for (var x = 0; x < $scope.paymentRules.length; x++) {
      if ($scope.paymentRules[x]._id === id) {
        $scope.paymentRules.splice(x, 1);
      }
    }
  };

  var replace = function (data) {
    for (var x = 0; x < $scope.paymentRules.length; x++) {
      if ($scope.paymentRules[x]._id === data._id) {
        $scope.paymentRules[x] = data;
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

  $scope.showPaymentRule = function (paymentRule) {
    $scope.singleView = true;
    $scope.singlePaymentRule = {};
    $scope.oldPaymentRule = {};
    angular.copy(paymentRule, $scope.oldPaymentRule);
    angular.copy(paymentRule, $scope.singlePaymentRule);
    getHistories($scope.singlePaymentRule._id);
  };

  $scope.delete = function () {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + $scope.singlePaymentRule.name + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/paymentrules/' + $scope.singlePaymentRule._id).success(function (data) {
        swal('Deleted!', $scope.singlePaymentRule.name + ' payment rule deleted.', 'success');
        removeFromCollection($scope.singlePaymentRule._id);
        $scope.closePaymentRule();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
        console.log(error);
        AuthSvc.handleError(error);
      });
    });
  };

  $scope.closePaymentRule = function () {
    $scope.singlePaymentRule = {};
    $scope.singleView = false;
    $scope.histories = [];
  };

  $scope.updatePaymentRule = function () {
    $http.put('/api/paymentrules/' + $scope.singlePaymentRule._id, $scope.singlePaymentRule).success(function (data) {
      replace(data);
      $scope.showPaymentRule(data);
      swal("Success", "Payment Rule updated.", "success");
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


}]);

