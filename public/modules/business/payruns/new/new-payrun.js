bulkPay.controller('BusinessNewPayRunCtrl', ['$scope', '$rootScope', '$timeout', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, $timeout, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

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

  $scope.$parent.inView = 'New Pay Run';
  $scope.options = {
    placeholder: "Choose One",
    allowClear: true
  };
  var businessId = '';
  $scope.dataFetched = false;
  $scope.payGroups = [{
    name: 'All',
    _id: 'all'
  }];
  $scope.payGroupId = 'all';
  $scope.currentPage = 1;
  $scope.pageSize = 25;
  $scope.filteredEmployees = [];
  $scope.payRunEmployees = [];
  $scope.singleEmploye = {};
  $scope.authorizeView = false;
  $scope.todayDate = new Date();
  $scope.payRunReportsView = false;
  $scope.preSelect = true;
  $scope.payRolls = [];
  $scope.settings = {
    selected: false,
    preSelected: false
  };
  $scope.payRun = {};
  $scope.months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  var getListOfYears = function () {
    var years = [];
    for (var x = new Date().getFullYear(); x < new Date().getFullYear() + 50; x++) {
      years.push(String(x));
    }
    return years;
  };
  $scope.years = getListOfYears();
  $scope.paymentPeriod = {
    month: $scope.months[new Date().getMonth()],
    year: String(new Date().getFullYear())
  };
  var setPayRun = function () {
    $scope.payRun = {
      paymentDate: new Date(),
      businessId: businessId
    };
  };


  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getPaymentEmployees(businessId);
    setPayRun();
  });

  var getPaymentEmployees = function (businessId) {
    $http.get('/api/employees/business/' + businessId + '/payrun').success(function (data) {
      $scope.payGroups = $scope.payGroups.concat(data.payGroups);
      $scope.employees = data.employees;
      _.each($scope.employees, function (employee) {
        employee.paymentInformation = new PayRollCalculation(employee, employee.payGrade.payTypes, employee.taxRule, employee.pensionRule).calculate();
      });
      $scope.filteredEmployees = $scope.employees;
      $scope.dataFetched = true;
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };

  $scope.changeGroup = function (payGroupId) {
    var employees = [];
    if (payGroupId === 'all') {
      $scope.filteredEmployees = $scope.employees;
    } else {
      _.each($scope.employees, function (employee) {
        if (employee.payGroupId === payGroupId) {
          employees.push(employee);
        }
      });
      $scope.filteredEmployees = employees;
    }
    return $scope.filteredEmployees;
  };

  $scope.showPayDetails = function (employee) {
    $scope.singleEmployee = employee;
  };

  $scope.getNonDeductions = function () {
    return $scope.singleEmployee.paymentInformation.payBreakDown.wages.concat($scope.singleEmployee.paymentInformation.payBreakDown.benefits);
  };

  $scope.resetSummary = function () {
    $scope.singleEmployee = {};
  };


  /*
   * Pay run processing
   * */
  $scope.startProcessing = function () {
    $scope.preSelect = false;
  };

  $scope.goBack = function () {
    $scope.preSelect = true;
  };

  $scope.initiatePayRun = function () {
    $scope.payRunEmployees = [];
    _.each($scope.filteredEmployees, function (employee) {
      if (employee.selected) {
        $scope.payRunEmployees.push(employee);
      }
    });
    if ($scope.payRunEmployees.length > 0) {
      $scope.authorizeView = true;
    } else {
      swal('Pay Run', 'No employee is selected.', 'warning');
    }
  };

  $scope.confirmPayRun = function () {
    swal({
      title: 'Are you sure?',
      text: 'Action is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $scope.payRun.numberOfEmployees = $scope.payRunEmployees.length;
      $scope.payRun.payGroup = $scope.getPayGroup();
      $scope.payRun.paymentPeriod = $scope.paymentPeriod;
      $scope.payRun.totalAmountPaid = $scope.getTotalAmountToBePaid();
      $scope.payRun.taxPaid = $scope.getTotalTaxToBePaid();
      $scope.payRun.pensionPaid = $scope.getTotalPensionToBePaid();
      $http.post('/api/payruns/', $scope.payRun).success(function (payRun) {
        var stage = 0;
        var payRolls = [];
        _.each($scope.payRunEmployees, function (employee) {
          $http.post('/api/payrolls', {
            businessId: businessId,
            payRunId: payRun._id,
            employee: employee._id,
            payGroup: employee.payGroupId,
            position: employee.positionId,
            pensionManager: employee.paymentDetails.pensionManager,
            grossPay: employee.paymentInformation.grossIncome / 12,
            tax: employee.paymentInformation.tax / 12,
            pension: employee.paymentInformation.pension / 12,
            totalDeduction: employee.paymentInformation.totalDeductions / 12,
            netPay: employee.paymentInformation.netPay / 12,
            payTypes: convertPayTypes(employee.paymentInformation.payBreakDown.wages.concat(employee.paymentInformation.payBreakDown.benefits, employee.paymentInformation.payBreakDown.deductions)),
            paymentDetails: employee.paymentDetails
          }).success(function (payRoll) {
            payRolls.push(payRoll);
            stage++;
            if (stage === $scope.payRunEmployees.length) {
              $scope.payRolls = payRolls;
              $scope.payRunReportsView = true;
              swal('Success!', 'Pay Run successful. View Report to take more actions.', 'success');
            }
          }).error(function (error) {
            AuthSvc.handleError(error);
          });
        });
      }).error(function (error) {
        AuthSvc.handleError(error);
      });
    });
  };

  var convertPayTypes = function (payTypes) {
    var types = payTypes;
    _.each(types, function (payType) {
      payType.monthlyValue = payType.value / 12;
    });
    return types;
  };

  $scope.back = function () {
    $scope.authorizeView = false;
  };

  $scope.getPayGroup = function () {
    return $scope.payGroupId === 'all' ? 'All' : _.find($scope.payGroups, function (payGroup) {
      return payGroup._id === $scope.payGroupId;
    }).name;
  };

  $scope.getTotalAmountToBePaid = function () {
    var sum = 0;
    _.each($scope.payRunEmployees, function (employee) {
      sum += employee.paymentInformation.netPay / 12;
    });
    return sum;
  };

  $scope.getTotalTaxToBePaid = function () {
    var tax = 0;
    _.each($scope.payRunEmployees, function (employee) {
      tax += employee.paymentInformation.tax / 12;
    });
    return tax;
  };

  $scope.getTotalPensionToBePaid = function () {
    var pension = 0;
    _.each($scope.payRunEmployees, function (employee) {
      pension += employee.paymentInformation.pension / 12;
    });
    return pension;
  };

  $scope.selectAll = function () {
    _.each($scope.payRolls, function (payRoll) {
      payRoll.selected = $scope.settings.selected;
    });
  };

  $scope.selectAllEmployees = function () {
    _.each($scope.filteredEmployees, function (employee) {
      employee.selected = $scope.settings.preSelected;
    });
  };

  $scope.mailPaySlips = function () {
    var payRolls = [];
    _.each($scope.payRolls, function (payRoll) {
      if (payRoll.selected) {
        payRolls.push(payRoll);
      }
    });
    if (payRolls.length > 0) {
      swal('Pay Slip', 'Pay slips sent.', 'success');
      $state.go('business.payruns');
    } else {
      swal('Pay Slip', 'Select at least one employee.', 'warning');
    }
  };

  $scope.mailLater = function () {
    swal('Pay Slip', 'Pay slips can still be sent from pay run report information page.', 'success');
    $state.go('business.payruns');
  };

}]);

