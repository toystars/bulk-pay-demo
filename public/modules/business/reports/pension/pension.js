bulkPay.controller('BusinessPensionReportCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.loan = {};
  $scope.employees = [];
  $scope.$parent.inView = 'Pension Report';
  var businessId = '';
  $scope.options = {
    placeholder: "Choose One"
  };
  $scope.currentPage = 1;
  $scope.pageSize = 25;
  $scope.reportPeriod = {
    month: 'January',
    year: 2013
  };

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getYears = function () {
    var years = [];
    for (var x = 1990; x < 2017; x++) {
      years.push(String(x));
    }
    return years;
  };

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

  $scope.years = getYears();


  $scope.employeeRegister = [{
    id: 401,
    fullName: 'Carla Grant',
    pensionNumber: 'PEN128172832',
    components: 260800,
    employeeContribution: 19560,
    employerContribution: 19560,
    total: 39120
  }, {
    id: 891,
    fullName: 'Emily Clark',
    pensionNumber: 'PEN981171432',
    components: 313500,
    employeeContribution: 23512,
    employerContribution: 23512,
    total: 47025
  }, {
    id: 281,
    fullName: 'Alexander Thompson',
    pensionNumber: 'PEN091121182',
    components: 162800,
    employeeContribution: 12210,
    employerContribution: 12210,
    total: 24420
  }, {
    id: 871,
    fullName: 'Lorna Okamoto',
    pensionNumber: 'PEN187161112',
    components: 78600,
    employeeContribution: 5482,
    employerContribution: 5482,
    total: 10965
  }];


  /*
   * Helpers
   * */

  $scope.calculateEMI = function () {
    var Loan = new LoanCalculator($scope.loan).evaluate();
    $scope.loan.emi = Loan.emi;
  };

  $scope.getComponentSum = function () {
    var sum = 0;
    _.each($scope.employeeRegister, function (employee) {
      sum += employee.components;
    });
    return sum;
  };

  $scope.getEmployeeSum = function () {
    var sum = 0;
    _.each($scope.employeeRegister, function (employee) {
      sum += employee.employeeContribution;
    });
    return sum;
  };

  $scope.getEmployerSum = function () {
    var sum = 0;
    _.each($scope.employeeRegister, function (employee) {
      sum += employee.employerContribution;
    });
    return sum;
  };

  $scope.getTotalSum = function () {
    var sum = 0;
    _.each($scope.employeeRegister, function (employee) {
      sum += employee.total;
    });
    return sum;
  };


  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
  });


}]);

