bulkPay.controller('BusinessEmployeeCreateCtrl', ['$scope', '$rootScope', '$timeout', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', 'imageUploader', function ($scope, $rootScope, $timeout, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state, imageUploader) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  $scope.$parent.inView = 'New Employee';
  $scope.inView = 'Personal Details';
  $scope.sourcePointer = 'Select';
  $scope.sourceId = '';
  $scope.sourceStatus = true;
  $scope.currentPayGrade = {
    payTypes: []
  };
  $scope.fetchedPayTypes = [];
  $scope.message = '';
  $scope.options = {
    placeholder: "Choose One",
    allowClear: true
  };

  var businessId = '';
  $scope.employee = {};
  $scope.businessUnits = [];
  $scope.payGroups = [];
  $scope.pensionManagers = [];
  var divisions = [];
  var departments = [];
  var positions = [];

  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getBusinessUnits(businessId);
    getBusinessDivisions(businessId);
    getDepartments(businessId);
    getPositions(businessId);
    getPayGroups(businessId);
    getPensionManagers(businessId);
    // getLastCreatedEmployee(businessId);
    resetEmployee();
  });


  $scope.changeView = function (view) {
    $scope.inView = view;
  };

  var getBusinessUnits = function (businessId) {
    $http.get('/api/businessunits/business/' + businessId).success(function (data) {
      $scope.businessUnits = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var getPayGroups = function (businessId) {
    $http.get('/api/paygroups/business/' + businessId).success(function (data) {
      $scope.payGroups = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var getBusinessDivisions = function (businessId) {
    $http.get('/api/divisions/business/' + businessId).success(function (data) {
      divisions = data;
      $scope.filteredDivisions = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var getDepartments = function (businessId) {
    $http.get('/api/departments/business/' + businessId).success(function (data) {
      departments = data;
      $scope.filteredDepartments = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var getPositions = function (businessId) {
    $http.get('/api/positions/business/' + businessId).success(function (data) {
      positions = data;
      $scope.filteredPositions = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var getPensionManagers = function (businessId) {
    $http.get('/api/pensionmanagers/business/' + businessId).success(function (data) {
      $scope.pensionManagers = data;
    }).error(function (error) {
      AuthSvc.handleError(error);
    })
  };

  var getLastCreatedEmployee = function (businessId) {
    $http.get('/api/employees/last/' + businessId).success(function (data) {
      console.log(data);
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };

  var resetEmployee = function () {
    $scope.employee = {
      businessId: businessId,
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
      location: '',
      status: '',
      profilePictures: [],
      currentProfilePicture: '',
      state: '',
      businessUnitId: '',
      divisionId: '',
      departmentId: '',
      positionId: '',
      employmentDate: '',
      confirmationDate: '',
      terminationDate: '',
      payGroupId: '',
      payGradeId: '',
      exemptedPayTypes: [],
      editablePayTypes: [],
      customPayTypes: [],
      paymentDetails: {
        paymentMethod: '',
        bank: '',
        accountName: '',
        pensionManager: '',
        RSAPin: ''
      },
      guarantor: {
        fullName: '',
        email: '',
        phone: '',
        address: ''
      }
    };
  };


  /*
   * Data
   * */
  $scope.genders = ['Male', 'Female'];
  $scope.maritalStatus = ['Single', 'Married', 'Divorced', 'Widowed'];
  $scope.statuses = ['Active', 'Inactive'];
  $scope.paymentMethods = ['Bank Transfer', 'Cheque', 'Cash'];
  $scope.banks = ['Stanbic IBTC Bank', 'UBA', 'Zenith Bank', 'First Bank', 'Union Bank', 'Sterling Bank', 'Access Bank', 'GTB', 'Skye Bank'];
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
   * Main controller logic
   * */
  $scope.$watch('employee.businessUnitId', function (newValue, oldValue) {
    if (newValue !== oldValue) {
      $scope.employee.divisionId = '';
      var newDivisions = [];
      if (!newValue) {
        newDivisions = divisions;
      } else if (newValue && newValue !== '') {
        _.each(divisions, function (division) {
          if (division.businessUnitId === newValue) {
            newDivisions.push(division);
          }
        });
      }
      $scope.filteredDivisions = newDivisions;
    }
  });

  $scope.$watch('employee.divisionId', function (newValue, oldValue) {
    if (newValue !== oldValue) {
      $scope.employee.departmentId = '';
      var newDepartments = [];
      if (!newValue) {
        newDepartments = departments;
      } else if (newValue && newValue !== '') {
        _.each(departments, function (department) {
          if (_.find(department.divisionsServed, function (divisionServed) { return divisionServed === 'All'; }) ||
            _.find(department.divisionsServed, function (divisionServed) { return divisionServed === newValue; }) ||
            department.divisionId === newValue) {
            newDepartments.push(department);
          }
        });
      }
      $scope.filteredDepartments = newDepartments;
    }
  });

  $scope.$watch('employee.departmentId', function (newValue, oldValue) {
    if (newValue !== oldValue) {
      $scope.employee.positionId = '';
      var newPositions = [];
      if (!newValue) {
        newPositions = positions;
      } else if (newValue && newValue !== '') {
        _.each(positions, function (position) {
          if (position.departmentId === newValue) {
            newPositions.push(position);
          }
        });
      }
      $scope.filteredPositions = newPositions;
    }
  });

  $scope.checkValidity = function () {
    $scope.message = '';
    var position = _.find(positions, function (currentPosition) {
      return currentPosition._id === $scope.employee.positionId;
    });
    if (position) {
      $http.get('/api/positions/' + position._id).success(function (data) {
        position = data;
        $http.get('/api/employees/position/' + position._id).success(function (data) {
          if (data.length >= position.numberOfAllowedEmployees) {
            $timeout(function() {
              $scope.employee.positionId = '';
              $scope.message = 'Select another position.';
              swal('Not Allowed', 'Already exceeded number of employees for ' + position.name + ' position. Contact admin if quota should be increased.', 'warning');
            });
          }
        }).error(function (error) {
          AuthSvc.handleError(error);
        });
      }).error(function (error) {
        AuthSvc.handleError(error);
      });
    }
  };

  $scope.copyStatus = function () {
    return $scope.sourceId && $scope.sourceId !== '';
  };

  $scope.$watch('employee.payGroupId', function (newValue, oldValue) {
    if ($scope.sourcePointer && $scope.sourcePointer !== 'Select') {
      $scope.setSource($scope.sourcePointer);
    }
  });

  $scope.setSource = function (source) {
    $scope.sourcePointer = source;
    $scope.sourceStatus = true;
    $scope.sourceId = '';
    switch (source) {
      case 'Payroll Template':
        // fetch all pay grades assigned to selected pay group
        $http.get('/api/paygrades/paygroup/' + $scope.employee.payGroupId).success(function (data) {
          $scope.copySource = data;
          _.each($scope.copySource, function (payGrade) {
            payGrade.display = payGrade.name;
            payGrade.displayId = payGrade._id;
          });
          $scope.sourceStatus = false;
        });
        break;
      case 'Employee':
        // fetch all employees assigned to selected pay group
        $http.get('/api/employees/paygroup/' + $scope.employee.payGroupId).success(function (data) {
          $scope.copySource = data;
          _.each($scope.copySource, function (employee) {
            employee.display = employee.firstName + ' ' + employee.lastName;
            employee.displayId = employee.payGradeId;
          });
          $scope.sourceStatus = false;
        });
        break;
    }
  };

  $scope.copy = function () {
    if ($scope.sourcePointer === 'Payroll Template') {
      $scope.currentPayGrade = _.find($scope.copySource, function (element) {
        return element._id === $scope.sourceId;
      });
      if ($scope.currentPayGrade) {
        $scope.employee.payGradeId = $scope.sourceId;
        _.each($scope.currentPayGrade.payTypes, function (payType) {
          if (payType.editablePerEmployee === 'Yes') {
            if ($scope.employee.editablePayTypes.length > 0) {
              _.each($scope.employee.editablePayTypes, function (type, index) {
                if (type.payTypeId === payType.payTypeId) {
                  $scope.employee.editablePayTypes[index] = payType;
                }
              });
            } else {
              $scope.employee.editablePayTypes.push(payType);
            }
          }
        });
      }
    } else {
      // get from employee using id as well...
    }
  };

  $scope.getTypes = function (type) {
    var types = [];
    $scope.employee.customPayTypes = $scope.employee.customPayTypes || [];
    $scope.employee.exemptedPayTypes = $scope.employee.exemptedPayTypes || [];
    var concatenatedPayTypes = $scope.currentPayGrade.payTypes.concat($scope.employee.customPayTypes);
    _.each(concatenatedPayTypes, function (payType) {
      if ($scope.employee.exemptedPayTypes.length === 0) {
        if (payType.type === type) {
          types.push(payType);
        }
      } else {
        if (!_.find($scope.employee.exemptedPayTypes, function (exType) {
            return exType.code === payType.code
          }) && payType.type === type) {
          types.push(payType);
        }
      }
    });
    return types;
  };

  var setUpCustom = function (which) {
    $scope.customType = {};
    $scope.customType.type = which;
    $scope.customType.editablePerEmployee = 'Yes';
    $scope.customType.derived = 'Fixed';
    $scope.customType.taxable = 'Yes';
    $scope.customType.status = 'Active';
    $scope.customType.save = true;
  };

  $scope.showOptions = function (which) {
    setUpCustom(which);
    swal({
      title: '',
      text: 'Add user specific pay type',
      showCancelButton: true,
      confirmButtonText: "Pre-defined pay type",
      cancelButtonText: "New pay type",
      confirmButtonColor: "#428BCA",
      cancelButtonColor: "#DD6B55",
      closeOnConfirm: true,
      closeOnCancel: true
    }, function (isConfirm) {
      if (isConfirm) {
        $http.get('/api/paytypes/business/custom/' + businessId + '/' + which).success(function (data) {
          $scope.fetchedPayTypes = [];
          _.each(data, function (type) {
            $scope.fetchedPayTypes.push({
              code: type.code,
              title: type.title,
              derived: type.derivative,
              status: type.status,
              type: type.type,
              value: 0,
              frequency: type.frequency,
              taxable: type.taxable,
              editablePerEmployee: type.editablePerEmployee,
              isBase: type.isBase
            });
          });
          jQuery('#predefined-modal-button').click();
        }).error(function (error) {
          AuthSvc.handleError(error);
        });
      } else {
        jQuery('#new-type-modal-button').click();
      }
    });
  };

  $scope.addCustomPayType = function (type) {
    if (type) {
      $scope.employee.customPayTypes.push(jQuery.extend(true, {}, type));
      jQuery('#predefined-modal-close').click();
    } else {
      $scope.customType.value = 0;
      $scope.employee.customPayTypes.push(jQuery.extend(true, {}, $scope.customType));
      if ($scope.customType.save) {
        $http.post('/api/paytypes/', {
          code: $scope.customType.code,
          title: $scope.customType.title,
          businessId: businessId,
          type: $scope.customType.type,
          frequency: $scope.customType.frequency,
          taxable: $scope.customType.taxable,
          editablePerEmployee: $scope.customType.editablePerEmployee,
          derivative: $scope.customType.derived,
          status: $scope.customType.status,
          isBase: false
        }).success(function (data) { }).error(function (error) { AuthSvc.handleError(error); });
      }
      jQuery('#new-pay-type-close').click();
    }
  };

  $scope.removePayType = function (payType) {
    if (!_.find($scope.employee.exemptedPayTypes, function (exType) {
        return exType.code === payType.code
      })) {
      $scope.employee.exemptedPayTypes.push({
        code: payType.code,
        title: payType.title
      });
    }
  };









  /*
  * Function to handle individual employee payment calculation
  * */
  var PayRollCalculation = function (employeePayTypes, employeeTaxRule, employeePensionRule) {

    // initializing variables
    var payTypes = employeePayTypes;
    var taxRule = employeeTaxRule;
    var pensionRule = employeePensionRule;

    var calculateGrossPay = function () {
      var grossPay = 0;
      _.each(payTypes, function (type) {
        if (type.type !== 'Deduction' && type.taxable === 'Yes') {
          grossPay += type.value;
        }
      });
      return grossPay;
    };

    var getOtherNonTaxableTypes = function () {
      return 0;
    };

    var calculateTaxableIncome = function () {
      return calculateGrossPay() - (calculateFlatTaxRelief() + calculatePercentageTaxRelief() + calculatePensionRelief() + getOtherNonTaxableTypes());
    };

    var calculatePercentageTaxRelief = function () {
      return taxRule.grossIncomeRelief * ( calculateGrossPay() / 100 );
    };

    var calculateFlatTaxRelief = function () {
      return (calculateGrossPay() > 20000000) ? calculateGrossPay() / 100 : 200000;
    };

    var calculatePensionRelief = function () {
      var sum = 0;
      _.each(pensionRule.payTypes, function (payTypeId) {
        var type = _.find(payTypes, function (element) { return element.payTypeId === payTypeId; });
        if (type) {
          sum += type.value;
        }
      });
      return pensionRule.employeeContributionRate * ( sum / 100 );
    };

    var calculateTax = function () {
      var totalTaxable = calculateTaxableIncome();
      var tax = 0;
      var rules = taxRule.rules;
      for (var x = 0; x < rules.length; x++) {
        if (totalTaxable > rules[x].upperLimitValue) {
          tax += rules[x].rate * ( rules[x].upperLimitValue / 100 );
          totalTaxable -= rules[x].upperLimitValue
        } else {
          tax += rules[x].rate * ( totalTaxable / 100 );
          break;
        }
      }

      return tax;
    };

    var calculate = function () {
      return {
        grossIncome: calculateGrossPay(),
        percentageGrossIncomeRelief: {
          rate: taxRule.grossIncomeRelief,
          value: calculatePercentageTaxRelief()
        },
        consolidatedRelief: calculateFlatTaxRelief(),
        pensionRelief: calculatePensionRelief(),
        totalTaxableIncome: calculateTaxableIncome(),
        tax: calculateTax(),
        totalDeductions: 0
      };
    };

    return {
      calculate: calculate
    };
  };



















  $scope.prepareSummary = function () {
    var concatenatedPayTypes = $scope.currentPayGrade.payTypes.concat($scope.employee.customPayTypes);
    $http.get('/api/taxes/' + $scope.currentPayGrade.taxRuleId).success(function (tax) {
      $http.get('/api/pensions/' + $scope.currentPayGrade.pensionRuleId).success(function (pension) {
        var calculator = new PayRollCalculation(concatenatedPayTypes, tax, pension);
        console.log(calculator.calculate());
      }).error(function (error) {
        AuthSvc.handleError(error);
      });
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
    return;
    $scope.newPayTypes = [];
    _.each(concatenatedPayTypes, function (payType, index) {
      _.each($scope.employee.editablePayTypes, function (type) {
        if (payType.code === type.code) {
          concatenatedPayTypes[index] = type;
        }
      });
      if (!_.find($scope.employee.exemptedPayTypes, function (exType) {
          return exType.code === payType.code
        })) {
        $scope.newPayTypes.push(payType);
      }
    });
  };



  $scope.resetSummary = function () {
    $scope.newPayTypes = [];
  };

  $scope.getNonDeductions = function () {
    var type = [];
    _.each($scope.newPayTypes, function (payType) {
      if (payType.type !== 'Deduction') {
        type.push(payType);
      }
    });
    return type;
  };

  $scope.getDeductions = function () {
    var type = [];
    _.each($scope.newPayTypes, function (payType) {
      if (payType.type === 'Deduction') {
        type.push(payType);
      }
    });
    return type;
  };

  $scope.getPaymentGross = function () {
    var sum = 0;
    _.each($scope.getNonDeductions(), function (payType) {
      sum += payType.value;
    });
    return sum;
  };

  var getNonTaxableDeductionsSum = function () {
    var sum = 0;
    _.each($scope.newPayTypes, function (payType) {
      if (payType.type === 'Deduction' && payType.taxable === 'No') {
        sum += payType.value;
      }
    });
    return sum;
  };

  $scope.getTax = function () {
    return {
      title: 'PAYE Tax',
      value: $scope.currentPayGrade.taxRate * (($scope.getPaymentGross() - getNonTaxableDeductionsSum()) / 100)
    };
  };

  $scope.getTotalDeductions = function () {
    var deductions = 0;
    _.each($scope.getDeductions(), function (deduction) {
      deductions += deduction.value;
    });
    return $scope.getTax().value + deductions;
  };

  $scope.restore = function (payType) {
    var matchedIndex = -1;
    _.each($scope.employee.exemptedPayTypes, function (type, index) {
      if (type.code === payType.code) {
        matchedIndex = index;
      }
    });
    if (matchedIndex !== -1) {
      $scope.employee.exemptedPayTypes.splice(matchedIndex, 1);
    }
  };

  $scope.fileSelected = function(files) {
    if (files && files.length) {
      $scope.file = files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#profile-img').attr('src', e.target.result);
      };
      reader.readAsDataURL($scope.file);
    }
  };

  $scope.createEmployee = function () {
    if ($scope.file) {
      imageUploader.imageUpload($scope.file).progress(function(evt) {
        $scope.cloudinaryRequest = true;
      }).success(function(data) {
        $scope.employee.profilePictures.push(data.name);
        $scope.employee.currentProfilePicture = data.name;
        saveEmployee();
      });
    } else {
      saveEmployee();
    }
  };

  var saveEmployee = function () {
    $http.post('/api/employees/', $scope.employee).success(function (data) {
      console.log(data);
      resetEmployee();
      $state.transitionTo($state.current, $stateParams, {
        reload: true,
        inherit: false,
        notify: true
      });
      swal('Success', 'Employee successfully created.', 'success');
    }).error(function (error) {
      console.log(error);
    });
    //getLastCreatedEmployee();
  };

  $scope.resetNewEmployee = function () {
    resetEmployee();
  };

}]);

