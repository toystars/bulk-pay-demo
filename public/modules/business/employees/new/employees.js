bulkPay.controller('BusinessEmployeeCreateCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

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

  var businessId = '';
  $scope.employee = {};
  $scope.businessUnits = [];
  $scope.payGroups = [];
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
    // getLastCreatedEmployee(businessId);
    resetEmployee();
  });

  $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
    triggerSelect();
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
    }).error(function (error) {
      console.log(error);
    });
  };

  var getDepartments = function (businessId) {
    $http.get('/api/departments/business/' + businessId).success(function (data) {
      departments = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var getPositions = function (businessId) {
    $http.get('/api/positions/business/' + businessId).success(function (data) {
      positions = data;
    }).error(function (error) {
      console.log(error);
    });
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
        accountName: ''
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

  $scope.getDivisions = function () {
    var newDivisions = [];
    var businessUnitId = $scope.employee.businessUnitId;
    if (businessUnitId && businessUnitId !== '') {
      _.each(divisions, function (division) {
        if (division.businessUnitId === businessUnitId) {
          newDivisions.push(division);
        }
      })
    } else {
      newDivisions = divisions;
    }
    return newDivisions;
  };

  $scope.getDepartments = function () {
    var newDepartments = [];
    var divisionId = $scope.employee.divisionId;
    if (divisionId && divisionId !== '') {
      _.each(departments, function (department) {
        if (department.divisionId === divisionId) {
          newDepartments.push(department);
        }
      })
    } else {
      newDepartments = departments;
    }
    return newDepartments;
  };

  $scope.getPositions = function () {
    var newPositions = [];
    var departmentId = $scope.employee.departmentId;
    if (departmentId && departmentId !== '') {
      _.each(positions, function (position) {
        if (position.departmentId === departmentId) {
          newPositions.push(position);
        }
      })
    } else {
      newPositions = positions;
    }
    return newPositions;
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

  $scope.prepareSummary = function () {
    var concatenatedPayTypes = $scope.currentPayGrade.payTypes.concat($scope.employee.customPayTypes);
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


  $scope.createEmployee = function () {
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


  /*
   * Helpers
   * */
  $scope.getPayGroup = function (id) {
    for (var x = 0; x < payGroups.length; x++) {
      if (payGroups[x]._id === id) {
        return payGroups[x];
      }
    }
  };

  $scope.getActivePayGroups = function () {
    var activePayGroups = [];
    for (var x = 0; x < payGroups.length; x++) {
      if (payGroups[x].status === 'Active') {
        activePayGroups.push(payGroups[x]);
      }
    }
    return activePayGroups;
  };

  $scope.getPayTypes = function (type) {
    var types = [];
    for (var x = 0; x < $scope.payTypes.length; x++) {
      if ($scope.payTypes[x].type === type && $scope.payTypes[x].status === 'Active') {
        types.push($scope.payTypes[x]);
      }
    }
    return types;
  };

  $scope.check = function (payType, type) {
    for (var x = 0; x < $scope.payGrade.payTypes.length; x++) {
      if ($scope.payGrade.payTypes[x].payTypeId === payType._id) {
        $scope.payGrade.payTypes.splice(x, 1);
        return;
      }
    }
    $scope.payGrade.payTypes.push({
      cellId: generateCellId($scope.payGrade.payTypes),
      code: payType.code,
      title: payType.title,
      derived: payType.derivative,
      payTypeId: payType._id,
      derivative: '',
      type: type,
      value: 0,
      editablePerEmployee: payType.editablePerEmployee
    });
  };

  var removeFromCollection = function (id) {
    for (var x = 0; x < $scope.payGrades.length; x++) {
      if ($scope.payGrades[x]._id === id) {
        $scope.payGrades.splice(x, 1);
      }
    }
  };

  var replace = function (data) {
    for (var x = 0; x < $scope.payGrades.length; x++) {
      if ($scope.payGrades[x]._id === data._id) {
        $scope.payGrades[x] = data;
      }
    }
  };

  $scope.getLastHistory = function () {
    return $scope.histories[$scope.histories.length - 1];
  };

  $scope.isPresent = function (id) {
    for (var x = 0; x < $scope.payGrade.payTypes.length; x++) {
      if ($scope.payGrade.payTypes[x].payTypeId === id) {
        return true;
      }
    }
    return false;
  };

  var getHistories = function (objectId) {
    $http.get('/api/histories/object/' + objectId).success(function (data) {
      $scope.histories = data;
    }).error(function (error) {
      console.log(error);
    });
  };


  /*
   * Single unit display
   * */
  $scope.singleView = false;
  $scope.editActive = false;
  $scope.histories = [];

  $scope.showPayGrade = function (payGrade) {
    $scope.singleView = true;
    $scope.singlePayGrade = {};
    $scope.oldPayGrade = {};
    angular.copy(payGrade, $scope.oldPayGrade);
    angular.copy(payGrade, $scope.singlePayGrade);
    getHistories($scope.singlePayGrade._id);
  };

  $scope.edit = function () {
    $scope.editActive = true;
    $scope.payGrade = $scope.singlePayGrade;
  };

  $scope.cancel = function () {
    $scope.editActive = false;
    resetPayGrade();
  };

  $scope.delete = function () {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + $scope.singlePayGrade.name + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/paygrades/' + $scope.singlePayGrade._id).success(function (data) {
        swal('Deleted!', $scope.singlePayGrade.title + ' pay grade deleted.', 'success');
        removeFromCollection($scope.singlePayGrade._id);
        $scope.closePayGrade();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
        console.log(error);
      });
    });
  };

  $scope.closePayGrade = function () {
    $scope.singlePayGrade = {};
    $scope.singleView = false;
    $scope.histories = [];
  };

  $scope.updatePayGrade = function () {
    $http.put('/api/paygrades/' + $scope.singlePayGrade._id, $scope.singlePayGrade).success(function (data) {
      getHistories(data._id);
      replace(data);
      $scope.editActive = false;
      resetPayGrade();
      swal("Success", "Pay grade updated.", "success");
    }).error(function (error) {
      console.log(error);
    });
  };

  $scope.calculate = function () {
    calculate();
  };

  $scope.payTypeSortConfig = {
    group: 'foobar',
    animation: 150,
    onSort: function (evt) {
      //compileForm();
    }
  };


  /*
   * jQuery
   * */
  /*jQuery.ig.loader({
   scriptPath: "http://cdn-na.infragistics.com/igniteui/latest/js/",
   resources: 'modules/infragistics.util.js,' + 'modules/infragistics.documents.core.js,' + 'modules/infragistics.excel.js'
   });

   var calculate = function () {
   var workbook = new $.ig.excel.Workbook($.ig.excel.WorkbookFormat.excel2007);
   var sheet = workbook.worksheets().add('Sheet1');
   sheet.columns(0).setWidth(180, $.ig.excel.WorksheetColumnWidthUnit.pixel);
   sheet.columns(1).setWidth(116, $.ig.excel.WorksheetColumnWidthUnit.pixel);
   sheet.columns(2).setWidth(124, $.ig.excel.WorksheetColumnWidthUnit.pixel);
   // loop through all payTypes to get the derived ones
   _.each($scope.payGrade.payTypes, function (element) {
   if (element.derived === 'Fixed') {
   if (element.value) {
   sheet.getCell(element.cellId).value(element.value);
   }
   } else {
   sheet.getCell(element.cellId).applyFormula(mapCellIds(element.derivative));
   element.value = sheet.getCell(element.cellId).value();
   }
   });
   };

   var mapCellIds = function (formula) {
   for (var x = 0; x < $scope.payGrade.payTypes.length; x++) {
   if (formula.indexOf($scope.payGrade.payTypes[x].code) !== -1) {
   var regex = new RegExp($scope.payGrade.payTypes[x].code, "g");
   formula = formula.replace(regex, $scope.payGrade.payTypes[x].cellId);
   }
   }
   return formula;
   };

   var generateCellId = function (collection) {
   var text = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   var randomNumber = Math.floor(Math.random() * (9 - 1)) + 1;
   for (var i = 0; i < 2; i++) {
   text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   var randomId = text + randomNumber;
   for (var x = 0; x < collection.length; x++) {
   if (collection[x].cellId === randomId) {
   generateCellId();
   }
   }
   return randomId;
   };*/


  var triggerSelect = function () {

    // select2
    jQuery('#employee-business-unit').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#employee-division').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#employee-department').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#employee-position').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#employee-gender').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#employee-marital-status').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#employee-state').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#employee-kin-state').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#employee-payment-method').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#employee-bank').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#employee-pay-group').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#employee-copy-from').select2({
      minimumResultsForSearch: 0
    });

    // date pickers
    jQuery('.datepicker-multiple').datepicker({
      changeMonth: true,
      changeYear: true
    });
  };


}]);

