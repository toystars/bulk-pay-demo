bulkPay.controller('BusinessNewLoanCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.loan = {};
  $scope.employees = [];
  $scope.$parent.inView = 'New Loan Application';
  var businessId = '';
  $scope.options = {
    placeholder: "Choose One"
  };

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getEmployees = function (businessId) {
    $http.get('/api/employees/business/' + businessId).success(function (employees) {
      $scope.employees = employees;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };

  var resetLoan = function () {
    $scope.loan = {
      businessId: businessId,
      payCount: 0
    };
  };


  /*
  * Helpers
  * */

  $scope.calculateEMI = function () {
    var loanAmount = $scope.loan.amount ? $scope.loan.amount : 0;
    var rate = $scope.loan.rate ? ($scope.loan.rate / 100) / 12 : 0;
    var duration = $scope.loan.term ? $scope.loan.term : 0;
    var calculatedEMI = ( loanAmount * (Math.pow(1 + rate, duration)) * rate ) / ( (Math.pow(1 + rate, duration)) - 1 );
    $scope.loan.emi = Math.round(calculatedEMI);
  };


  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getEmployees(businessId);
    resetLoan();
  });


  $scope.createLoan = function () {
    $http.post('/api/loans/', $scope.loan).success(function (loan) {
      swal('Success', ' Loan created.', 'success');
      $state.go('business.loans');
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };

  $scope.cancel = function () {
    $state.go('business.loans');
  };


}]);

