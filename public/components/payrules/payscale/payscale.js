bulkPay.controller('PayScaleCtrl', ['$scope', 'toastr', 'AuthSvc', 'OrgSvc', 'PayTypesSvc', '$cookies', 'PayScalesSvc', 'StructureSvc', function ($scope, toastr, AuthSvc, OrgSvc, PayTypesSvc, $cookies, PayScalesSvc, StructureSvc) {

  AuthSvc.checkLoggedInStatus();
  OrgSvc.checkOrgStatus();

  $scope.payments = [];
  $scope.newPayment = {};
  $scope.errorMessage = '';
  $scope.errorOccur = false;
  $scope.isEdit = false;
  var levels = [];
  var companyId = JSON.parse($cookies.get('userCompany'))._id;


  $scope.payScales = [];
  $scope.payTypes = [];
  $scope.newPayScale = {};

  var resetPayScale = function () {
    return {
      code: '',
      title: '',
      description: '',
      companyId: companyId,
      status: '',
      jobLevelId: '',
      payTypes: []
    };
  };

  var getCompanyTypes = function () {
    PayTypesSvc.getCompanyPayTypes(companyId).success(function (data) {
      $scope.payTypes = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var getCompanyLevels = function () {
    StructureSvc.getCompanyJobLevels(companyId).success(function (data) {
      levels = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  var getCompanyPayScales = function () {
    PayScalesSvc.getCompanyPayScales(companyId).success(function (data) {
      $scope.payScales = data;
    }).error(function (error) {
      console.log(error)
    })
  };

  getCompanyTypes();
  getCompanyPayScales();
  getCompanyLevels();
  $scope.newPayScale = resetPayScale();

  $scope.displayActiveStatus = function (status) {
    return status === 'Active';
  };

  $scope.displayPayScale = function () {
    return $scope.payScales.length > 0;
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

  $scope.getActiveLevels = function () {
    var activeLevels = [];
    for (var x = 0; x < levels.length; x++) {
      if (levels[x].status === 'Active') {
        activeLevels.push(levels[x]);
      }
    }
    return activeLevels;
  };


  $scope.check = function (payType, type) {
    for (var x = 0; x < $scope.newPayScale.payTypes.length; x++) {
      if ($scope.newPayScale.payTypes[x].id === payType._id) {
        $scope.newPayScale.payTypes.splice(x, 1);
        return;
      }
    }
    $scope.newPayScale.payTypes.push({
      cellId: generateCellId($scope.newPayScale.payTypes),
      code: payType.code,
      title: payType.title,
      derived: payType.derivative,
      id: payType._id,
      derivative: '',
      type: type,
      value: 0,
      editablePerEmployee: payType.editablePerEmployee
    });
  };

  $scope.getNewPayScaleTypes = function () {
    return $scope.newPayScale.payTypes;
  };

  $scope.getPaymentFromId = function (id) {
    for (var x = 0; x < $scope.payTypes.length; x++) {
      if ($scope.payTypes[x]._id === id) {
        return $scope.payTypes[x];
      }
    }
  };

  $scope.savePayScale = function () {
    calculate();
    PayScalesSvc.createPayScale($scope.newPayScale).success(function (data) {
      console.log(data);
      swal('Created!', 'Pay Scale ' + data.code + ' created.', 'success');
      getCompanyTypes();
      getCompanyPayScales();
      $scope.newPayScale = resetPayScale();
    }).error(function (data) {
      console.log(data);
    });
  };

  $scope.removePayScale = function (payScale) {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + payScale.title + ' pay scale is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      PayScalesSvc.deletePayScale(payScale._id).success(function (data) {
        swal('Deleted!', data.message, 'success');
        getCompanyTypes();
        getCompanyPayScales();
        $scope.newPayScale = resetPayScale();
      }).error(function (data) {
        console.log(data);
        swal('Error Occurred', error.message, 'warning');
      });
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
   *  PayScale view functions
   * */

  $scope.singlePayScale = {};
  $scope.isView = false;
  $scope.viewPayScale = function (payScale) {
    $scope.singlePayScale = payScale;
    $scope.isView = true;
  };

  $scope.closePayScale = function () {
    $scope.isView = false;
    $scope.singlePayScale = {};
  };


  /*
   * Validation
   * */
  $scope.validate = function () {
    if ((!$scope.newPayScale.code || $scope.newPayScale.code === '') || (!$scope.newPayScale.title || $scope.newPayScale.title === '') ||
      (!$scope.newPayScale.description || $scope.newPayScale.description === '') || (!$scope.newPayScale.companyId || $scope.newPayScale.companyId === '') ||
      (!$scope.newPayScale.status || $scope.newPayScale.status === '') || (!$scope.newPayScale.jobLevelId || $scope.newPayScale.jobLevelId === '')) {
      return true;
    }

    for (var x = 0; x < $scope.newPayScale.payTypes.length; x++) {
      if ($scope.newPayScale.payTypes[x].editablePerEmployee !== 'Yes') {
        if (!$scope.newPayScale.payTypes[x].value || $scope.newPayScale.payTypes[x].value === 0) {
          return true;
        }
      }
    }
    return false;
  };


  /*
   *
   * All jQuery code here...
   *
   * */
  jQuery.ig.loader({
    scriptPath: "http://cdn-na.infragistics.com/igniteui/latest/js/",
    resources: 'modules/infragistics.util.js,' +
    'modules/infragistics.documents.core.js,' +
    'modules/infragistics.excel.js'
  });

  var calculate = function () {
    var workbook = new $.ig.excel.Workbook($.ig.excel.WorkbookFormat.excel2007);
    var sheet = workbook.worksheets().add('Sheet1');
    sheet.columns(0).setWidth(180, $.ig.excel.WorksheetColumnWidthUnit.pixel);
    sheet.columns(1).setWidth(116, $.ig.excel.WorksheetColumnWidthUnit.pixel);
    sheet.columns(2).setWidth(124, $.ig.excel.WorksheetColumnWidthUnit.pixel);
    // loop through all payTypes to get the derived ones
    _.each($scope.newPayScale.payTypes, function (element) {
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
    for (var x = 0; x < $scope.newPayScale.payTypes.length; x++) {
      if (formula.indexOf($scope.newPayScale.payTypes[x].code) !== -1) {
        var regex = new RegExp($scope.newPayScale.payTypes[x].code, "g");
        formula = formula.replace(regex, $scope.newPayScale.payTypes[x].cellId);
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

}]);