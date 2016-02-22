

bulkPay.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'toastrConfig', 'cfpLoadingBarProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider, toastrConfig, cfpLoadingBarProvider) {

    cfpLoadingBarProvider.includeSpinner = false;
    $urlRouterProvider.otherwise('/dashboard');

    angular.extend(toastrConfig, {
      timeOut: 2000
    });

    $stateProvider

      .state('home', {
        url: '/',
        templateUrl: 'modules/main/home/home.html',
        controller: 'HomeCtrl'
      })

      .state('home.overview', {
        url: 'dashboard',
        templateUrl: 'modules/main/overview/overview.html',
        controller: 'OverviewCtrl',
        authenticate: true,
        data: {
          pageTitle: 'Dashboard | BulkPay'
        }
      })

      .state('home.newbusiness', {
        url: 'dashboard/business/new',
        templateUrl: 'modules/main/business/business.html',
        controller: 'CreateBusinessCtrl',
        data: {
          pageTitle: 'New Business | BulkPay'
        }
      })

      .state('business', {
        url: '/business/:businessId',
        templateUrl: 'modules/business/home/home.html',
        controller: 'BusinessHomeCtrl'
      })

      .state('business.overview', {
        url: '/overview',
        templateUrl: 'modules/business/overview/overview.html',
        controller: 'BusinessOverviewCtrl',
        data: {
          pageTitle: 'Overview | BulkPay'
        }
      })

      .state('business.updatebusiness', {
        url: '/update',
        templateUrl: 'modules/business/update-business/update.html',
        controller: 'BusinessUpdateCtrl',
        data: {
          pageTitle: 'Update Business | BulkPay'
        }
      })

      .state('business.units', {
        url: '/units',
        templateUrl: 'modules/business/units/units.html',
        controller: 'BusinessUnitsCtrl',
        data: {
          pageTitle: 'Units | BulkPay'
        }
      })

      .state('business.divisions', {
        url: '/divisions',
        templateUrl: 'modules/business/divisions/divisions.html',
        controller: 'BusinessDivisionsCtrl',
        data: {
          pageTitle: 'Divisions | BulkPay'
        }
      })

      .state('business.departments', {
        url: '/departments',
        templateUrl: 'modules/business/departments/departments.html',
        controller: 'BusinessDepartmentsCtrl',
        data: {
          pageTitle: 'Departments | BulkPay'
        }
      })

      .state('business.positions', {
        url: '/positions',
        templateUrl: 'modules/business/positions/positions.html',
        controller: 'BusinessPositionsCtrl',
        data: {
          pageTitle: 'Positions | BulkPay'
        }
      })

      .state('business.payment', {
        url: '/paytypes',
        templateUrl: 'modules/business/pay-types/pay-types.html',
        controller: 'BusinessPayTypesCtrl',
        data: {
          pageTitle: 'Pay Types | BulkPay'
        }
      })

      .state('business.paygroups', {
        url: '/paygroups',
        templateUrl: 'modules/business/pay-groups/pay-groups.html',
        controller: 'BusinessPayGroupsCtrl',
        data: {
          pageTitle: 'Pay Groups | BulkPay'
        }
      })



      /*

      .state('home.deduction', {
        url: 'rules/deductions',
        templateUrl: 'components/payrules/deduction/deduction.html',
        controller: 'DeductionCtrl',
        data: {
          pageTitle: 'Deductions | BulkPay'
        }
      })

      .state('home.payscale', {
        url: 'rules/payscales',
        templateUrl: 'components/payrules/payscale/payscale.html',
        controller: 'PayScaleCtrl',
        data: {
          pageTitle: 'Pay Scales | BulkPay'
        }
      })

      .state('home.newemployee', {
        url: 'employee/new',
        templateUrl: 'components/employee/new/employee.create.html',
        controller: 'EmployeeCreateCtrl',
        data: {
          pageTitle: 'New Employee | BulkPay'
        }
      })*/


      .state('login', {
        url: '/login',
        templateUrl: 'modules/auth/login/login.html',
        controller: 'loginCtrl',
        data: {
          pageTitle: 'Login | BulkPay'
        }
      })

      .state('signup', {
        url: '/signup',
        templateUrl: 'modules/auth/signup/signup.html',
        controller: 'signUpCtrl',
        data: {
          pageTitle: 'Sign Up | BulkPay'
        }
      })

  }]);