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
      $scope.employees = data;
      _.each($scope.employees, function (employee) {
        employee.paymentInformation = new PayRollCalculation(employee, employee.payGrade.payTypes, employee.payGrade.tax,
          employee.payGrade.pension).calculate();
      });
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };

  $scope.showPayDetails = function (employee) {
    $scope.singleEmployee = employee;
  };

  $scope.getAllowances = function () {
    if ($scope.singleEmployee && $scope.singleEmployee.paymentInformation.payBreakDown) {
      return $scope.singleEmployee.paymentInformation.payBreakDown.wages.concat($scope.singleEmployee.paymentInformation.payBreakDown.benefits);
    }
    return [];
  };

  $scope.getTotalAllowanceValue = function () {
    var sum  = 0;
    if ($scope.singleEmployee && $scope.singleEmployee.paymentInformation.payBreakDown) {
      var array = $scope.singleEmployee.paymentInformation.payBreakDown.wages.concat($scope.singleEmployee.paymentInformation.payBreakDown.benefits);
      _.each(array, function (payType) {
        sum += payType.monthlyValue;
      });
    }
    return sum;
  };

  $scope.getDeductions = function () {
    if ($scope.singleEmployee && $scope.singleEmployee.paymentInformation.payBreakDown) {
      return $scope.singleEmployee.paymentInformation.payBreakDown.deductions.concat($scope.singleEmployee.paymentInformation.payBreakDown.repayments);
    }
    return [];
  };

  $scope.getTotalDeductionsValue = function () {
    var sum  = 0;
    if ($scope.singleEmployee && $scope.singleEmployee.paymentInformation.payBreakDown) {
      var array = $scope.singleEmployee.paymentInformation.payBreakDown.deductions.concat($scope.singleEmployee.paymentInformation.payBreakDown.repayments);
      _.each(array, function (payType) {
        sum += payType.monthlyValue;
      });
    }
    return sum;
  };

  $scope.getOtherPayTypes = function () {
    if ($scope.singleEmployee && $scope.singleEmployee.paymentInformation.payBreakDown) {
      return $scope.singleEmployee.paymentInformation.payBreakDown.expenses;
    }
    return [];
  };

  $scope.getTotalOthersValue = function () {
    var sum  = 0;
    if ($scope.singleEmployee && $scope.singleEmployee.paymentInformation.payBreakDown) {
      var array = $scope.singleEmployee.paymentInformation.payBreakDown.expenses;
      _.each(array, function (payType) {
        sum += payType.monthlyValue;
      });
    }
    return sum;
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
    _.each($scope.employees, function (employee) {
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
            grossPay: employee.paymentInformation.grossIncome,
            tax: employee.paymentInformation.tax,
            pension: employee.paymentInformation.pension,
            totalDeduction: employee.paymentInformation.totalDeductions,
            netPay: employee.paymentInformation.netPay,
            paymentPeriod: payRun.paymentPeriod,
            paymentDetails: employee.paymentDetails,
            paymentInformation: employee.paymentInformation.payBreakDown,
            repayments: evaluateRepayments(employee.paymentInformation.payBreakDown.repayments),
            expenses: employee.paymentInformation.payBreakDown.expenses
          }).success(function (payRoll) {
            console.log(payRoll);
            payRolls.push(payRoll);
            updateLoans(employee.paymentInformation.payBreakDown.repayments);
            serviceExpenses( employee.paymentInformation.payBreakDown.expenses);
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

  var serviceExpenses = function (expenses) {
    _.each(expenses, function (expense) {
      $http.put('/api/expense/' + expense.expense._id + '/service').success(function (response) { }).error(function (error) {
        console.log(error);
        AuthSvc.handleError(error);
      });
    });
  };

  var updateLoans = function (repayments) {
    _.each(repayments, function (repayment) {
      var object = {
        id: repayment.loanObject.id,
        interest: repayment.loanObject.runAnalysis.interest,
        principal: repayment.loanObject.runAnalysis.principal,
        payment: repayment.loanObject.runAnalysis.EMI,
        basePrincipal: repayment.loanObject.runAnalysis.basePrincipal,
        amountLeft: repayment.loanObject.runAnalysis.currentPrincipal - repayment.loanObject.runAnalysis.principal,
        paymentPeriod: $scope.paymentPeriod
      };
      $http.put('/api/loans/' + object.id + '/repayment', object).success(function (response) {

      }).error(function (error) {
        console.log(error);
        AuthSvc.handleError(error);
      });
    });
  };

  var evaluateRepayments = function (repayments) {
    var newRepayments = [];
    _.each(repayments, function (repayment) {
      newRepayments.push({
        interest: repayment.loanObject.runAnalysis.interest,
        principal: repayment.loanObject.runAnalysis.principal,
        payment: repayment.loanObject.runAnalysis.EMI,
        basePrincipal: repayment.loanObject.runAnalysis.basePrincipal,
        amountLeft: repayment.loanObject.runAnalysis.currentPrincipal - repayment.loanObject.runAnalysis.principal
      });
    });
    return newRepayments;
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
      sum += employee.paymentInformation.netPay;
    });
    return sum;
  };

  $scope.getTotalTaxToBePaid = function () {
    var tax = 0;
    _.each($scope.payRunEmployees, function (employee) {
      tax += employee.paymentInformation.tax;
    });
    return tax;
  };

  $scope.getTotalPensionToBePaid = function () {
    var pension = 0;
    _.each($scope.payRunEmployees, function (employee) {
      pension += employee.paymentInformation.pension;
    });
    return pension;
  };

  $scope.selectAll = function () {
    _.each($scope.payRolls, function (payRoll) {
      payRoll.selected = $scope.settings.selected;
    });
  };

  $scope.selectAllEmployees = function () {
    _.each($scope.employees, function (employee) {
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

