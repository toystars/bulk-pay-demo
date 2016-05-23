bulkPay.controller('EmployeeSelfPaySlipCtrl', ['$scope', '$timeout', 'toastr', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $timeout, toastr, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.dataFetched = false;
  $scope.payRolls = [];
  var businessId = $cookies.get('selfBusinessId');
  var employeeId = $cookies.get('selfEmployeeId');
  $scope.currentPage = 1;
  $scope.pageSize = 25;
  $scope.singlePayroll = {
    payTypes: []
  };

  $scope.$parent.inView = 'Payslips';
  $scope.filter = {
    startDate: moment().subtract(1, 'month')._d,
    endDate: moment()._d
  };


  var getFilteredEmployeePaySlips = function () {
    $scope.dataFetched = false;
    var andArray = [{
      businessId: businessId
    }, {
      createdAt: { '$gte': moment($scope.filter.startDate).startOf('day'), '$lte': moment($scope.filter.endDate).endOf('day') }
    }];
    var keys = Object.keys($scope.filter);
    if (keys.length > 0) {
      for (var x = 0; x < keys.length; x++) {
        if ($scope.filter.hasOwnProperty(keys[x]) && keys[x] !== 'startDate' && keys[x] !== 'endDate') {
          if ($scope.filter[keys[x]] && $scope.filter[keys[x]] !== '') {
            var object = {};
            object[keys[x]] = $scope.filter[keys[x]];
            andArray.push(object);
          }
        }
      }
    }
    $http.post('/api/payrolls/' + employeeId + '/filtered', { $and: andArray }).success(function (payRolls) {
      $scope.payRolls = payRolls;
      $scope.dataFetched = true;
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };

  $scope.viewPaySlip = function (payRoll) {
    $scope.singlePayroll = payRoll;
  };

  $scope.getPayPeriod = function (payRun) {
    return payRun.paymentPeriod.month + ', ' + payRun.paymentPeriod.year;
  };

  $scope.getAllowances = function () {
    if ($scope.singlePayroll && $scope.singlePayroll.paymentInformation) {
      return $scope.singlePayroll.paymentInformation.wages.concat($scope.singlePayroll.paymentInformation.benefits);
    }
    return [];
  };

  $scope.getTotalAllowanceValue = function () {
    var sum  = 0;
    if ($scope.singlePayroll && $scope.singlePayroll.paymentInformation) {
      var array = $scope.singlePayroll.paymentInformation.wages.concat($scope.singlePayroll.paymentInformation.benefits);
      _.each(array, function (payType) {
        sum += payType.monthlyValue;
      });
    }
    return sum;
  };

  $scope.getDeductions = function () {
    if ($scope.singlePayroll && $scope.singlePayroll.paymentInformation) {
      return $scope.singlePayroll.paymentInformation.deductions.concat($scope.singlePayroll.paymentInformation.repayments);
    }
    return [];
  };

  $scope.getTotalDeductionsValue = function () {
    var sum  = 0;
    if ($scope.singlePayroll && $scope.singlePayroll.paymentInformation) {
      var array = $scope.singlePayroll.paymentInformation.deductions.concat($scope.singlePayroll.paymentInformation.repayments);
      _.each(array, function (payType) {
        sum += payType.monthlyValue;
      });
    }
    return sum;
  };

  $scope.getOtherPayTypes = function () {
    if ($scope.singlePayroll && $scope.singlePayroll.paymentInformation) {
      return $scope.singlePayroll.paymentInformation.expenses;
    }
    return [];
  };

  $scope.getTotalOthersValue = function () {
    var sum  = 0;
    if ($scope.singlePayroll && $scope.singlePayroll.paymentInformation) {
      var array = $scope.singlePayroll.paymentInformation.expenses;
      _.each(array, function (payType) {
        sum += payType.monthlyValue;
      });
    }
    return sum;
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

  $scope.alterFilter = function () {
    getFilteredEmployeePaySlips();
  };

}]);

