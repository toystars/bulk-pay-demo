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
    $scope.currentPayGrade = {
      payTypes: []
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
          if (_.find(department.divisionsServed, function (divisionServed) {
              return divisionServed === 'All';
            }) ||
            _.find(department.divisionsServed, function (divisionServed) {
              return divisionServed === newValue;
            }) ||
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
            $timeout(function () {
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
            employee.displayId = employee._id;
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
      var copiedEmployee = _.find($scope.copySource, function (element) {
        return element._id === $scope.sourceId;
      });
      if (copiedEmployee) {
        // fetch payGrade
        $http.get('/api/paygrades/' + copiedEmployee.payGradeId).success(function (data) {
          $scope.currentPayGrade = data;
          $scope.employee.payGradeId = data._id;
          $scope.employee.editablePayTypes = copiedEmployee.editablePayTypes;
          $scope.employee.customPayTypes = copiedEmployee.customPayTypes;
          $scope.employee.exemptedPayTypes = copiedEmployee.exemptedPayTypes;
        }).error(function (error) {
          AuthSvc.handleError(error);
        });
      }
    }
  };

  $scope.getTypes = function (type) {
    var types = [];
    var foundType = {};
    $scope.employee.customPayTypes = $scope.employee.customPayTypes || [];
    $scope.employee.exemptedPayTypes = $scope.employee.exemptedPayTypes || [];
    var concatenatedPayTypes = $scope.currentPayGrade.payTypes.concat($scope.employee.customPayTypes);
    _.each(concatenatedPayTypes, function (payType) {
      if ($scope.employee.exemptedPayTypes.length === 0) {
        if (payType.type === type) {
          foundType = _.find($scope.employee.editablePayTypes, function (editableType) {
            return editableType.code === payType.code
          });
          if (foundType) {
            types.push(foundType);
          } else {
            types.push(payType);
          }
        }
      } else {
        if (!_.find($scope.employee.exemptedPayTypes, function (exType) {
            return exType.code === payType.code
          }) && payType.type === type) {
          foundType = _.find($scope.employee.editablePayTypes, function (editableType) {
            return editableType.code === payType.code
          });
          if (foundType) {
            types.push(foundType);
          } else {
            types.push(payType);
          }
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
        }).success(function (data) {
        }).error(function (error) {
          AuthSvc.handleError(error);
        });
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

  $scope.payrollInformation = {
    payBreakDown: {
      wages: [],
      benefits: [],
      deductions: []
    }
  };
  $scope.prepareSummary = function () {
    $http.get('/api/paygroups/' + $scope.employee.payGroupId).success(function (payGroup) {
      console.log(payGroup);
      var calculator = new PayRollCalculation($scope.employee, $scope.currentPayGrade.payTypes, payGroup.tax, payGroup.pension);
      $scope.payrollInformation = calculator.calculate();
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


  $scope.resetSummary = function () {
    $scope.payrollInformation = {
      payBreakDown: {
        wages: [],
        benefits: [],
        deductions: []
      }
    };
  };

  $scope.getNonDeductions = function () {
    return $scope.payrollInformation.payBreakDown.wages.concat($scope.payrollInformation.payBreakDown.benefits);
  };

  $scope.getPaymentGross = function () {
    var sum = 0;
    _.each($scope.getNonDeductions(), function (payType) {
      sum += payType.value;
    });
    return sum;
  };

  $scope.getDeductions = function () {
    return $scope.payrollInformation.payBreakDown.deductions;
  };

  $scope.getTotalDeductions = function () {
    return $scope.payrollInformation.totalDeductions;
  };

  $scope.getNetPayment = function () {
    return $scope.payrollInformation.netPay;
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

  $scope.fileSelected = function (files) {
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
      imageUploader.imageUpload($scope.file).progress(function (evt) {
        $scope.cloudinaryRequest = true;
      }).success(function (data) {
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

  $scope.print = function (elementId) {
    var printContents = document.getElementById(elementId).innerHTML;
    var popupWin;
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      popupWin = window.open('', '_blank', 'width=800,height=9000,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      popupWin.window.focus();
      popupWin.document.write('<!DOCTYPE html><html><head>' + '<link rel="stylesheet" type="text/css" href="http://localhost:5000/styles/main.css />' + '<link rel="stylesheet" type="text/css" href="styles/custom.css" />' + '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
      popupWin.onbeforeunload = function (event) {
        popupWin.close();
        return '';
      };
      popupWin.onabort = function (event) {
        popupWin.document.close();
        popupWin.close();
      }
    }
    else {
      popupWin = window.open('', '_blank', 'width=800,height=9000');
      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="http://localhost:5000/styles/main.css" /><link rel="stylesheet" type="text/css" href="styles/custom.css" /></head><body onload="window.print()">' + printContents + '</html>');
      popupWin.document.close();
    }
    popupWin.document.close();
    return true;
  }

}]);

