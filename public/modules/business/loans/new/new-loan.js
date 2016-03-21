bulkPay.controller('BusinessNewLoanCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.loan = {};
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

  var resetLoan = function () {
    $scope.loan = {
      businessId: businessId
    };
  };


  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    resetLoan();
  });


  $scope.createLoan = function () {
    $http.post('/api/paygroups/', $scope.payGroup).success(function (loan) {

      swal('Success', ' Loan created.', 'success');
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


}]);

