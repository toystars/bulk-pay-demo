

bulkPay.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'toastrConfig',
  function($stateProvider, $urlRouterProvider, $locationProvider, toastrConfig) {

    $urlRouterProvider.otherwise('/home');

    angular.extend(toastrConfig, {
      timeOut: 2000
    });

    $stateProvider

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

      .state('home', {
        url: '/',
        templateUrl: 'modules/main/home/home.html',
        controller: 'HomeCtrl'
      })

      .state('home.overview', {
        url: 'home',
        templateUrl: 'modules/main/overview/overview.html',
        controller: 'OverviewCtrl',
        authenticate: true,
        data: {
          pageTitle: 'Home | BulkPay'
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

      .state('business.jobs', {
        url: '/jobs',
        templateUrl: 'modules/business/jobs/jobs.html',
        controller: 'BusinessJobsCtrl',
        data: {
          pageTitle: 'Jobs | BulkPay'
        }
      })

      .state('business.orgchart', {
        url: '/chart',
        templateUrl: 'modules/business/org-chart/org-chart.html',
        controller: 'BusinessOrgChartCtrl',
        data: {
          pageTitle: 'Org Chart | BulkPay'
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

      .state('business.paygrades', {
        url: '/paygrades',
        templateUrl: 'modules/business/pay-grades/pay-grades.html',
        controller: 'BusinessPayGradesCtrl',
        data: {
          pageTitle: 'Pay Grades | BulkPay'
        }
      })

      .state('business.taxes', {
        url: '/taxes',
        templateUrl: 'modules/business/taxes/taxes.html',
        controller: 'BusinessTaxesCtrl',
        data: {
          pageTitle: 'Tax Rules | BulkPay'
        }
      })

      .state('business.pensions', {
        url: '/pensions',
        templateUrl: 'modules/business/pensions/pensions.html',
        controller: 'BusinessPensionsCtrl',
        data: {
          pageTitle: 'Pensions | BulkPay'
        }
      })

      .state('business.newemployee', {
        url: '/employee/new',
        templateUrl: 'modules/business/employees/new/new-employee.html',
        controller: 'BusinessEmployeeCreateCtrl',
        data: {
          pageTitle: 'New Employee | BulkPay'
        }
      })

      .state('business.manageemployees', {
        url: '/employees',
        templateUrl: 'modules/business/employees/manage/manage-employees.html',
        controller: 'BusinessEmployeesManagerCtrl',
        data: {
          pageTitle: 'Manage Employees | BulkPay'
        }
      })

      .state('business.employee', {
        url: '/employee/:employeeId',
        templateUrl: 'modules/business/employees/single/single-employee.html',
        controller: 'BusinessSingleEmployeeCtrl',
        data: {
          pageTitle: 'Profile | BulkPay'
        }
      })

      .state('business.payruns', {
        url: '/payruns',
        templateUrl: 'modules/business/payruns/manage/manage-payruns.html',
        controller: 'BusinessPayRunsManagerCtrl',
        data: {
          pageTitle: 'Pay Runs | BulkPay'
        }
      })

      .state('business.newpayrun', {
        url: '/payrun/new',
        templateUrl: 'modules/business/payruns/new/new-payrun.html',
        controller: 'BusinessNewPayRunCtrl',
        data: {
          pageTitle: 'New Pay Runs | BulkPay'
        }
      })

      .state('business.oneoff', {
        url: '/payments',
        templateUrl: 'modules/business/payruns/one-offs/one-offs.html',
        controller: 'BusinessOneOffCtrl',
        data: {
          pageTitle: 'One Off Payments | BulkPay'
        }
      })

      .state('business.payrun', {
        url: '/payrun/single/:payRunId',
        templateUrl: 'modules/business/payruns/single/single-payrun.html',
        controller: 'BusinessSinglePayRunCtrl',
        data: {
          pageTitle: 'Pay Run | BulkPay'
        }
      })

      .state('business.newloan', {
        url: '/loan/new',
        templateUrl: 'modules/business/loans/new/new-loan.html',
        controller: 'BusinessNewLoanCtrl',
        data: {
          pageTitle: 'New Loan | BulkPay'
        }
      })

      .state('business.loans', {
        url: '/loans',
        templateUrl: 'modules/business/loans/manage/manage-loans.html',
        controller: 'BusinessLoansManagerCtrl',
        data: {
          pageTitle: 'Loans | BulkPay'
        }
      })

      .state('business.loanpaymentrules', {
        url: '/loan/rules',
        templateUrl: 'modules/business/loans/payment/payment.html',
        controller: 'BusinessLoanPaymentRulesCtrl',
        data: {
          pageTitle: 'Payment Rules | BulkPay'
        }
      })

  }]);