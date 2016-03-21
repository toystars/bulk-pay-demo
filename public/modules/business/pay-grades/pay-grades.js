
bulkPay.controller('BusinessPayGradesCtrl', ['$scope', '$rootScope', '$timeout', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, $timeout, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.payGrade = {};
  $scope.payGrades = [];
  $scope.payTypes = [];
  $scope.$parent.inView = 'Pay Grades';
  var payGroups = [];
  var businessId = '';
  $scope.dataFetched = false;
  $scope.activePayGroups = [];
  $scope.options = {
    placeholder: "Choose One"
  };
  $scope.statuses = ['Active', 'Inactive'];

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getPayGrades = function (businessId) {
    $http.get('/api/paygrades/business/' + businessId).success(function (data) {
      $scope.payGrades = data;
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
    });
  };

  var getPayGroups = function (businessId) {
    $http.get('/api/paygroups/business/' + businessId).success(function (data) {
      payGroups = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var getPayTypes = function (businessId) {
    $http.get('/api/paytypes/business/' + businessId).success(function (data) {
      $scope.payTypes = data;
      resetPayGrade();
    }).error(function (error) {
      console.log(error);
    })
  };

  var resetPayGrade = function () {
    $scope.payGrade = {
      code: '',
      name: '',
      description: '',
      businessId: businessId,
      status: '',
      payGroupId: '',
      payTypes: []
    };
    insertBaseTypes();
  };

  var insertBaseTypes = function () {
    var concatenated = getBasePayTypes('Wage').concat(getBasePayTypes('Benefit'), getBasePayTypes('Deduction'));
    _.each(concatenated, function (type) {
      $scope.check(type, type.type);
    });
  };

  var getBasePayTypes = function (type) {
    var types = [];
    for (var x = 0; x < $scope.payTypes.length; x++) {
      if ($scope.payTypes[x].type === type && $scope.payTypes[x].status === 'Active' && $scope.payTypes[x].isBase === true) {
        types.push($scope.payTypes[x]);
      }
    }
    return types;
  };



  /*
   * Event Listeners
   * */
  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getPayGrades(businessId);
    getPayGroups(businessId);
    getPayTypes(businessId);
  });



  $scope.createPayGrade = function () {
    $http.post('/api/paygrades/', $scope.payGrade).success(function (data) {
      $timeout(function() {
        $scope.payGrades.push(data);
        resetPayGrade();
        jQuery('#new-pay-grade-close').click();
        swal('Success', ' Pay Grade created.', 'success');
      });
    }).error(function (error) {
      console.log(error);
    });
  };

  $scope.resetNewGrade = function () {
    resetPayGrade();
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

  $scope.setActivePayGroups = function () {
    var activePayGroups = [];
    for (var x = 0; x < payGroups.length; x++) {
      if (payGroups[x].status === 'Active') {
        activePayGroups.push(payGroups[x]);
      }
    }
    $scope.activePayGroups = activePayGroups;
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
      value: null,
      isBase: payType.isBase,
      frequency: payType.frequency,
      taxable: payType.taxable,
      editablePerEmployee: payType.editablePerEmployee
    });
  };

  $scope.getBaseStatus = function (status) {
    return status ? ' - Base' : '';
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
    $scope.setActivePayGroups();
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
        swal('Deleted!', $scope.singlePayGrade.name + ' pay grade deleted.', 'success');
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
  jQuery.ig.loader({
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
  };

  // Progress Wizard With Disabled Tab Click
  jQuery('#progressWizard').bootstrapWizard({
    onTabShow: function (tab, navigation, index) {
      tab.prevAll().addClass('done');
      tab.nextAll().removeClass('done');
      tab.removeClass('done');

      var $total = navigation.find('li').length;
      var $current = index + 1;

      if ($current >= $total) {
        $('#progressWizard').find('.wizard .next').addClass('hide');
        $('#progressWizard').find('.wizard .finish').removeClass('hide');
      } else {
        $('#progressWizard').find('.wizard .next').removeClass('hide');
        $('#progressWizard').find('.wizard .finish').addClass('hide');
      }

      var $percent = ($current / $total) * 100;
      $('#progressWizard').find('.progress-bar').css('width', $percent + '%');
    },
    onTabClick: function (tab, navigation, index) {
      return false;
    }
  });

  jQuery('#progress-wizard-new').bootstrapWizard({
    onTabShow: function (tab, navigation, index) {
      tab.prevAll().addClass('done');
      tab.nextAll().removeClass('done');
      tab.removeClass('done');

      var $total = navigation.find('li').length;
      var $current = index + 1;

      if ($current >= $total) {
        $('#progress-wizard-new').find('.wizard .next').addClass('hide');
        $('#progress-wizard-new').find('.wizard .finish').removeClass('hide');
      } else {
        $('#progress-wizard-new').find('.wizard .next').removeClass('hide');
        $('#progress-wizard-new').find('.wizard .finish').addClass('hide');
      }

      var $percent = ($current / $total) * 100;
      $('#progress-wizard-new').find('.progress-bar').css('width', $percent + '%');
    },
    onTabClick: function (tab, navigation, index) {
      return false;
    }
  });


}]);

