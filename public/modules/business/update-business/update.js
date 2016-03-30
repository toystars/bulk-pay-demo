
bulkPay.controller('BusinessUpdateCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', 'Business', '$state', '$http', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, Business, $state, $http) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.$parent.inView = 'Update Business Info';
  $scope.businessHistory = [];
  $scope.currencies = [];
  $scope.currency = '';

  $http.get('data/currencies.json').success(function (currencies) {
    var keys = Object.keys(currencies);
    _.each(keys, function (key) {
      if (currencies.hasOwnProperty(key)) {
        $scope.currencies.push({
          currency: key,
          format: currencies[key].format,
          symbol: currencies[key].symbol
        });
      }
    });
  }).error(function (error) {
    console.log(error);
  });

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    $scope.business = BusinessDataSvc.getBusiness();
  }

  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, businesses) {
    $scope.business = businesses;
    $scope.currency = $scope.business.currency.currency;
  });

  $rootScope.$on('history.fetched', function (event, history) {
    $scope.businessHistory = history;
  });

  $scope.getLastHistory = function () {
    return $scope.businessHistory[$scope.businessHistory.length - 1];
  };

  $scope.getCurrencyString = function (currency) {
    return currency.currency + ' - ' + currency.symbol;
  };

  $scope.changeCurrency = function () {
    $scope.business.currency = _.find($scope.currencies, function (currency) {
      return currency.currency === $scope.currency;
    });
  };

  $scope.updateBusiness = function () {
    Business.update($scope.business).success(function (data) {
      $scope.business = data;
      BusinessDataSvc.refreshBusiness();
      swal("Success", "Business updated successfully.", "success");
    }).error(function (error) {
      console.log(error);
    })
  };

  $scope.cancel = function () {
    swal({
      title: 'Confirm',
      text: 'Do you really want to cancel?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a94442',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
      closeOnConfirm: true
    }, function () {
      $state.go('business.overview');
    });
  };

  $scope.sanitizeClass = function (id) {
    return '.class' + id + 'acc';
  };


  /*
   * Data
   * */
  $scope.states = ['Abia State',
    'Adamawa State',
    'Akwa Ibom State',
    'Anambra State',
    'Bauchi State',
    'Bayelsa State',
    'Benue State',
    'Borno State',
    'Cross River State',
    'Delta State',
    'Ebonyi State',
    'Edo State',
    'Ekiti State',
    'Enugu State',
    'Federal Capital Territory',
    'Gombe State',
    'Imo State',
    'Jigawa State',
    'Kaduna State',
    'Kano State',
    'Katsina State',
    'Kebbi State',
    'Kogi State',
    'Kwara State',
    'Lagos State',
    'Nasarawa State',
    'Niger State',
    'Ogun State',
    'Ondo State',
    'Osun State',
    'Oyo State',
    'Plateau State',
    'Rivers State',
    'Sokoto State',
    'Taraba State',
    'Yobe State',
    'Zamfara State'
  ];

  $scope.industries = ['Accommodations',
    'Accounting',
    'Advertising',
    'Aerospace',
    'Agriculture & Agribusiness',
    'Air Transportation',
    'Apparel & Accessories',
    'Auto',
    'Banking',
    'Beauty & Cosmetics',
    'Biotechnology',
    'Chemical',
    'Communications',
    'Computer',
    'Construction',
    'Consulting',
    'Consumer Products',
    'Education',
    'Electronics',
    'Employment',
    'Energy',
    'Entertainment & Recreation',
    'Fashion',
    'Financial Services',
    'Food & Beverage',
    'Health',
    'Information',
    'Information Technology',
    'Technology',
    'Telecommunications',
    'Video Game',
    'Web Services'
  ];

  $scope.statuses = ['Active', 'Inactive'];

}]);








