bulkPay.controller('BusinessLoansManagerCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.$parent.inView = 'Manage Loans';
  var businessId = '';
  $scope.options = {
    placeholder: "Choose One"
  };
  $scope.loans = [];

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getLoans = function (businessId) {
    $http.get('/api/loans/business/' + businessId).success(function (loans) {
      $scope.loans = loans;
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    })
  };


  /*
   * Event Listeners
   * */

  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getLoans(businessId);
  });


  /*
  * Helpers
  * */

  $scope.getComputedTerm = function (months) {
    var years = months / 12;
    return months + ' months' + ' (' + parseFloat(years.toFixed(2)) + ' years)';
  };

  $scope.getAmountPaid = function (loan) {
    var difference = loan.amount - loan.activeAmount;
    return difference > 0 ? difference : loan.amount;
  };



  /*
   * Single unit display
   * */

  $scope.singleView = false;

  $scope.showLoan = function (loan) {
    $scope.singleView = true;
    $scope.singleLoan = {};
    $scope.oldLoan = {};
    angular.copy(loan, $scope.oldLoan);
    angular.copy(loan, $scope.singleLoan);
  };

  $scope.closeLoan = function () {
    $scope.singleLoan = {};
    $scope.singleView = false;
  };


}]);

