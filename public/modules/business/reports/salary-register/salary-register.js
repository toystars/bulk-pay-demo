bulkPay.controller('BusinessSalaryRegisterCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.loan = {};
  $scope.employees = [];
  $scope.$parent.inView = 'Salary Register';
  var businessId = '';
  $scope.options = {
    placeholder: "Choose One"
  };
  $scope.currentPage = 1;
  $scope.pageSize = 25;
  $scope.reportPeriod = {
    month: 'February',
    year: 2014
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
    overtimeRate: 20,
    overtimeHours: 16,
    tax: 38162,
    pension: 13981,
    gross: 451998,
    deduction: 72091,
    taxablePay: 370231
  }, {
    id: 891,
    fullName: 'Emily Clark',
    overtimeRate: 18,
    overtimeHours: 11,
    tax: 43182,
    pension: 12431,
    gross: 387123,
    deduction: 51981,
    taxablePay: 276120
  }, {
    id: 281,
    fullName: 'Alexander Thompson',
    overtimeRate: 38,
    overtimeHours: 11,
    tax: 38162,
    pension: 13981,
    gross: 512871,
    deduction: 89123,
    taxablePay: 440192
  }, {
    id: 871,
    fullName: 'Lorna Okamoto',
    overtimeRate: 20,
    overtimeHours: 16,
    tax: 27182,
    pension: 9872,
    gross: 220981,
    deduction: 34123,
    taxablePay: 187123
  }];


  /*
   * Helpers
   * */

  $scope.calculateEMI = function () {
    var Loan = new LoanCalculator($scope.loan).evaluate();
    $scope.loan.emi = Loan.emi;
  };


  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
  });


}]);

