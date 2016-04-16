bulkPay.controller('BusinessSinglePayRunCtrl', ['$scope', '$rootScope', '$timeout', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, $timeout, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  $scope.options = {
    placeholder: "Choose One",
    allowClear: true
  };
  var businessId = '';
  $scope.dataFetched = false;
  $scope.currentPage = 1;
  $scope.pageSize = 25;
  var payRunId = $stateParams.payRunId;
  $scope.payRolls = [];
  $scope.payRun = {};
  $scope.singlePayroll = {
    payTypes: []
  };

  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getPayRunInfo();
    getPayRolls();
  });


  var getPayRunInfo = function () {
    $http.get('/api/payruns/' + payRunId).success(function (payRun) {
      $scope.payRun = payRun;
    }).error(function (error) {
      $state.go('business.payruns');
    })
  };

  var getPayRolls = function () {
    $http.get('/api/payrolls/payrun/' + payRunId).success(function (payRolls) {
      $scope.payRolls = payRolls;
      $scope.dataFetched = true;
    }).error(function (error) {
      AuthSvc.handleError(error);
    })
  };

  $scope.viewPaySlip = function (payRoll) {
    $scope.singlePayroll = payRoll;
    console.log(payRoll);
  };

  $scope.getNonDeductions = function () {
    var types = [];
    _.each($scope.singlePayroll.payTypes, function (type) {
      if (type.type !== 'Deduction') {
        types.push(type);
      }
    });
    return types;
  };

  $scope.getDeductions = function () {
    var types = [];
    _.each($scope.singlePayroll.payTypes, function (type) {
      if (type.type === 'Deduction') {
        types.push(type);
      }
    });
    return types;
  };

  $scope.resetSummary = function () {
    $scope.singlePayroll = {
      payTypes: []
    };
  };




  $scope.print = function (elementId) {
    var printContents = document.getElementById(elementId).innerHTML;
    var popupWin;
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      popupWin = window.open('', '_blank', 'width=800,height=9000,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      popupWin.window.focus();
      popupWin.document.write('<!DOCTYPE html><html><head>' + '<link rel="stylesheet" type="text/css" href="http://localhost:5000/styles/main.css />' + '<link rel="stylesheet" type="text/css" href="styles/custom.css" />' + '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
      popupWin.onbeforeunload = function (event) {
        popupWin.close();
        return '';
      };
      popupWin.onabort = function (event) {
        popupWin.document.close();
        popupWin.close();
      }
    }
    else {
      popupWin = window.open('', '_blank', 'width=800,height=9000');
      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="http://localhost:5000/styles/main.css" /><link rel="stylesheet" type="text/css" href="styles/custom.css" /></head><body onload="window.print()">' + printContents + '</html>');
      popupWin.document.close();
    }
    popupWin.document.close();
    return true;
  };

}]);

