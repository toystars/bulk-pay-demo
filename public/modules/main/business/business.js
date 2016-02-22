bulkPay.controller('CreateBusinessCtrl', ['$scope', 'AuthSvc', '$cookies', '$state', '$http', function ($scope, AuthSvc, $cookies, $state, $http) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.$parent.inView = 'New Business';
  var userId = AuthSvc.getCurrentUser()._id;

  /*
   * Initializing data and helper functions
   * */
  var resetBusiness = function () {
    $scope.newBusiness = {
      name: '',
      address: '',
      city: '',
      state: '',
      website: '',
      country: 'Nigeria',
      industry: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      creatorId: userId,
      creator: userId
    };
  };


  /*
   * Main logic
   * */

  resetBusiness();

  $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
    triggerSelect();
  });

  $scope.save = function () {
    /*
    * Validation to be handled later
    * */
    $http.post('/api/businesses', $scope.newBusiness).success(function (business) {
      if (business) {
        swal("Success", "Business created successfully.", "success");
        resetBusiness();
        AuthSvc.refreshUser();
      }
    }).error(function (error) {
      console.log(error);
    });
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


  /*
   * JQuery
   * */

  jQuery('#new-business-state').change(function () {
    $scope.$apply(function () {
      $scope.newBusiness.state = jQuery('#new-business-state').val();
    });
  });
  jQuery('#new-business-industry').change(function () {
    $scope.$apply(function () {
      $scope.newBusiness.industry = jQuery('#new-business-industry').val();
    });
  });

  var triggerSelect = function () {
    jQuery('#new-business-state').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#new-business-industry').select2({
      minimumResultsForSearch: 0
    });
  };

}]);