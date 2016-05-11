bulkPay.controller('SelfOverviewCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });


  $scope.$parent.inView = 'Self Overview';
  $scope.options = {
    placeholder: "Choose One"
  };

  


}]);

