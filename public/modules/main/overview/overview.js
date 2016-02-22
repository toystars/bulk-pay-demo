
bulkPay.controller('OverviewCtrl', ['$scope', '$state', 'AuthSvc', function ($scope, $state, AuthSvc) {


  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  var getBusinesses = function () {
    $scope.businesses = AuthSvc.getBusinesses();
  };

  getBusinesses();




}]);