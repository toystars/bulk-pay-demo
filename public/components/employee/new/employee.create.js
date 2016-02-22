bulkPay.controller('EmployeeCreateCtrl', ['$scope', '$window', 'toastr', 'OrgSvc', '$cookies', '$state', 'AuthSvc', 'StructureSvc', 'PayScalesSvc', function ($scope, $window, toastr, OrgSvc, $cookies, $state, AuthSvc, StructureSvc, PayScalesSvc) {

  AuthSvc.checkLoggedInStatus();
  OrgSvc.checkOrgStatus();

  $scope.inView = 'Personal Details';
  $scope.newEmployee = {};
  var companyId = JSON.parse($cookies.get('userCompany'))._id;
  var sourceId = '';
  $scope.payScales = [];
  $scope.departments = [];
  $scope.jobLevels = [];
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

  jQuery('#select-copy-from').change(function () {
    $scope.$apply(function() {
      sourceId = jQuery('#select-copy-from').val();
    });
  });

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

  jQuery('#select-department').change(function () {
    $scope.$apply(function() {
      $scope.newEmployee.departmentId = jQuery('#select-department').val();
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

  jQuery('#select-state').change(function () {
    $scope.newEmployee.state = jQuery('#select-state').val();
  });

  jQuery('#select-kin-state').change(function () {
    $scope.newEmployee.guarantor.state = jQuery('#select-kin-state').val();
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


  /*
   * jQuery
   * */
  // Tags Input
  var triggerSelect = function () {
    jQuery('#tags').tagsInput({
      width: 'auto'
    });

    // Textarea Autogrow
    jQuery('#autoResizeTA').autogrow();

    // Spinner
    var spinner = jQuery('#spinner').spinner();
    spinner.spinner('value', 0);

    // Form Toggles
    jQuery('.toggle').toggles({
      on: true
    });

    // Time Picker
    jQuery('#timepicker').timepicker({
      defaultTIme: false
    });
    jQuery('#timepicker2').timepicker({
      showMeridian: false
    });
    jQuery('#timepicker3').timepicker({
      minuteStep: 15
    });

    // Date Picker
    jQuery('#datepicker').datepicker();
    jQuery('#datepicker-inline').datepicker();
    jQuery('.datepicker-multiple').datepicker({
      changeMonth: true,
      changeYear: true
    });

    // Input Masks
    jQuery("#date").mask("99/99/9999");
    jQuery("#phone").mask("(999) 999-9999");
    jQuery("#ssn").mask("999-99-9999");

    // Select2
    jQuery("#select-basic, #select-multi").select2();
    jQuery('#select-gender').select2({
      minimumResultsForSearch: -1
    });

    jQuery('#select-state').select2({
      minimumResultsForSearch: 0
    });

    jQuery('#select-marital-status').select2({
      minimumResultsForSearch: -1
    });

    jQuery('#select-state').select2({
      minimumResultsForSearch: 0
    });

    jQuery('#select-kin-state').select2({
      minimumResultsForSearch: 0
    });


    jQuery('#select-employee-type').select2({
      minimumResultsForSearch: -1
    });

    jQuery('#select-department').select2({
      minimumResultsForSearch: -1
    });

    jQuery('#select-job-level').select2({
      minimumResultsForSearch: -1
    });

    jQuery('#select-job-title').select2({
      minimumResultsForSearch: -1
    });

    jQuery('#select-station').select2({
      minimumResultsForSearch: -1
    });

    jQuery('#select-contract').select2({
      minimumResultsForSearch: -1
    });

    jQuery('#select-payment-method').select2({
      minimumResultsForSearch: -1
    });

    jQuery('#select-bank').select2({
      minimumResultsForSearch: -1
    });

    jQuery('#select-copy-from').select2({
      minimumResultsForSearch: -1
    });


    function format(item) {
      return '<i class="fa ' + ((item.element[0].getAttribute('rel') === undefined) ? "" : item.element[0].getAttribute('rel')) + ' mr10"></i>' + item.text;
    }

    // This will empty first option in select to enable placeholder
    jQuery('select option:first-child').text('');

    jQuery("#select-templating").select2({
      formatResult: format,
      formatSelection: format,
      escapeMarkup: function (m) {
        return m;
      }
    });

    // Color Picker
    if (jQuery('#colorpicker').length > 0) {
      jQuery('#colorSelector').ColorPicker({
        onShow: function (colpkr) {
          jQuery(colpkr).fadeIn(500);
          return false;
        },
        onHide: function (colpkr) {
          jQuery(colpkr).fadeOut(500);
          return false;
        },
        onChange: function (hsb, hex, rgb) {
          jQuery('#colorSelector span').css('backgroundColor', '#' + hex);
          jQuery('#colorpicker').val('#' + hex);
        }
      });
    }

    // Color Picker Flat Mode
    jQuery('#colorpickerholder').ColorPicker({
      flat: true,
      onChange: function (hsb, hex, rgb) {
        jQuery('#colorpicker3').val('#' + hex);
      }
    });
  };

}]);








