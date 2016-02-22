
bulkPay.controller('DeductionCtrl', ['$scope', '$localStorage', 'toastr', function ($scope, $localStorage, toastr) {

  $scope.$storage = $localStorage;
  $scope.$storage.payments = $scope.$storage.payments || [];
  console.log($scope.$storage.payments);

}]);