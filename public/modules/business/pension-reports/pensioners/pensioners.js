bulkPay.controller('BusinessPensionersReportCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

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
  $scope.filter = {
    searchTerm: ''
  };


  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }


  $scope.pensioners = [{
    fullName: 'Daniel Rob',
    pensionNumber: 'PEN128172832',
    address: '2429 Cottage Street, Bloomington, IN 47401',
    email: 'dannirob@yahoo.com',
    phone: '(742) 477-6869',
    nominees: {
      name: 'David Becks',
      address: '690 Canterbury Drive Rahway, NJ 07065',
      phoneNumber: '(742) 477-6869',
      relationship: 'Brother'
    }
  }, {
    fullName: 'Emeka Isiogwu',
    pensionNumber: 'PEN981171432',
    address: '772 4th Avenue Bristow, VA 20136',
    email: 'eisogwu@gmail.com',
    phone: '(146) 861-5348',
    nominees: {
      name: 'Chigozie Isiogwu',
      address: '405 Devonshire Drive Mount Pleasant, SC 29464',
      phoneNumber: '(745) 251-9847',
      relationship: 'Son'
    }
  }, {
    fullName: 'Joseph Babalola',
    pensionNumber: 'PEN091121182',
    address: '197 Hamilton Road, Fredericksburg, VA 22405',
    email: 'josephbabs@yahoo.com',
    phone: '(386) 710-2993',
    nominees: {
      name: 'Anita Babalola',
      address: '658 Manor Drive Ballston Spa, NY 12020',
      phoneNumber: '(650) 760-2440',
      relationship: 'Spouse'
    }
  }, {
    fullName: 'Halimat Bello',
    pensionNumber: 'PEN187161112',
    address: '989 Madison Street, Menomonee Falls, WI 53051',
    email: 'halifax@gmail.com',
    phone: '(208) 232-1841',
    nominees: {
      name: 'Azeez Bello',
      address: '494 Oxford Road San Lorenzo, CA 94580',
      phoneNumber: '(989) 787-2287',
      relationship: 'Son'
    }
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


  /*
  * Single View
  * */

  $scope.singleView = false;
  $scope.pensioner = {};

  $scope.viewPensioner = function (pensioner) {
    $scope.singleView = true;
    $scope.singlePensioner = pensioner;
  };

  $scope.closePensioner = function () {
    $scope.singleView = false;
    $scope.singlePensioner = {};
  };


}]);

