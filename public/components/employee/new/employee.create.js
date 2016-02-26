bulkPay.controller('EmployeeCreateCtrl', ['$scope', '$window', 'toastr', 'OrgSvc', '$cookies', '$state', 'AuthSvc', 'StructureSvc', 'PayScalesSvc', function ($scope, $window, toastr, OrgSvc, $cookies, $state, AuthSvc, StructureSvc, PayScalesSvc) {

  AuthSvc.checkLoggedInStatus();
  OrgSvc.checkOrgStatus();

  $scope.inView = 'Personal Details';
  $scope.newEmployee = {};
  var companyId = JSON.parse($cookies.get('userCompany'))._id;
  var sourceId = '';
  $scope.payScales = [];
  $scope.departments = [];
  $scope.positions = [];
  $scope.sourcePointer = 'Select';
  $scope.copySource = [];

  /*
   * Utility functions
   * */
  $scope.dataReady = function () {
    return $scope.departments.length === 0 || $scope.departments.length === 0 || $scope.departments.length === 0;
  };

  $scope.changeView = function (view) {
    $scope.inView = view;
  };

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    triggerSelect();
  });

  var getCompanyPayScales = function () {
    PayScalesSvc.getCompanyPayScales(companyId).success(function (data) {
      $scope.payScales = data;
    }).error(function (error) {
      console.log(error)
    })
  };

  var getCompanyDepartments = function () {
    StructureSvc.getCompanyDepartments(companyId).success(function (data) {
      $scope.departments = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var getCompanyJobLevels = function () {
    StructureSvc.getCompanyJobLevels(companyId).success(function (data) {
      $scope.jobLevels = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var getCompanyPositions = function () {
    StructureSvc.getCompanyPositions(companyId).success(function (data) {
      $scope.positions = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var resetEmployee = function () {
    $scope.newEmployee = {
      companyId: companyId,
      employeeId: '',
      firstName: '',
      lastName: '',
      otherNames: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      departmentId: '',
      jobLevelId: '',
      positionId: '',
      employmentDate: '',
      confirmationDate: '',
      terminationDate: '',
      paymentDetails: {
        paymentMethod: '',
        bank: '',
        accountName: ''
      },
      payroll: {
        from: '',
        id: '',
        payTypes: []
      },
      guarantor: {
        fullName: '',
        email: '',
        phone: '',
        address: ''
      }
    };
  };

  var clearEmployeeDetails = function () {
    resetEmployee();
    $scope.changeView('Personal Details');
  };

  $scope.copy = function () {
    if ($scope.sourcePointer === 'Payroll Template') {
      // get from payScales using id
      var data = _.find($scope.payScales, function (element) {
        return element._id === sourceId;
      });
      if (data) {
        $scope.newEmployee.payroll.from = $scope.sourcePointer;
        $scope.newEmployee.payroll.id = sourceId;
        angular.copy(data.payTypes, $scope.newEmployee.payroll.payTypes);
      }
    } else {
      // get from employee using id as well...
    }
    console.log($scope.newEmployee);
  };


  jQuery('#select-payment-method').change(function () {
    $scope.$apply(function() {
      $scope.newEmployee.paymentDetails.paymentMethod = jQuery('#select-payment-method').val();
    });
  });

  jQuery('#select-bank').change(function () {
    $scope.$apply(function() {
      $scope.newEmployee.paymentDetails.bank = jQuery('#select-bank').val();
    });
  });

  jQuery('#select-job-level').change(function () {
    $scope.$apply(function () {
      $scope.newEmployee.jobLevelId = jQuery('#select-job-level').val();
    });
  });

  jQuery('#select-job-title').change(function () {
    $scope.$apply(function () {
      $scope.newEmployee.positionId = jQuery('#select-job-title').val();
    });
  });

  jQuery("#select-gender").change(function () {
    $scope.newEmployee.gender = jQuery("#select-gender").val();
  });

  jQuery("#select-marital-status").change(function () {
    $scope.newEmployee.maritalStatus = jQuery("#select-marital-status").val();
  });

  /*
   * Controller logic
   * */
  clearEmployeeDetails();
  getCompanyPayScales();
  getCompanyDepartments();
  getCompanyJobLevels();
  getCompanyPositions();


  $scope.createEmployee = function () {
    console.log($scope.newEmployee);
  };

  $scope.setSource = function (source) {
    if (source !== $scope.sourcePointer) {
      $scope.sourcePointer = source;
      switch (source) {
        case 'Payroll Template':
          angular.copy($scope.payScales, $scope.copySource);
          break;
        case 'Employee':
          $scope.copySource = [];
          break;
      }
      _.each($scope.copySource, function (element) {
        if (source === 'Payroll Template') {
          element.display = element.title;
        } else {
          element.display = element.firstName + ' ' + element.lastName;
        }
      });
    }
    console.log($scope.copySource);
  };

  $scope.getTypes = function (type) {
    var types = [];
    _.each($scope.newEmployee.payroll.payTypes, function (element) {
      if (element.type === type) {
        types.push(element);
      }
    });
    return types;
  };





  /*
  * Type edit section
  * */
  $scope.openType = function (type) {
    console.log(type);
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
    'Zamfara State'];



}]);








