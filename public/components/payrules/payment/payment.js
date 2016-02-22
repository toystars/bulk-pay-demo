
bulkPay.controller('PaymentCtrl', ['$scope', 'toastr', 'PayTypesSvc', 'AuthSvc', 'OrgSvc', '$cookies', function ($scope, toastr, PayTypesSvc, AuthSvc, OrgSvc, $cookies) {

  AuthSvc.checkLoggedInStatus();
  OrgSvc.checkOrgStatus();

  $scope.payments = [];
  $scope.newPayment = { };
  $scope.errorMessage = '';
  $scope.errorOccur = false;
  $scope.isEdit = false;

  var resetPayment = function () {
    return {
      code: '',
      title: '',
      type: '',
      derivative: '',
      frequency: '',
      taxable: '',
      status: '',
      editablePerEmployee: ''
    };
  };

  // get all payTypes
  var getAllPayments = function () {
    PayTypesSvc.getCompanyPayTypes(JSON.parse($cookies.get('userCompany'))._id).success(function (data) {
      $scope.payments = data;
    }).error(function (error) {
      console.log(error);
    });
  };

  $scope.reset = function () {
    $scope.newPayment = resetPayment();
    $scope.isEdit = false;
  };

  getAllPayments();

  $scope.reset();

  $scope.displayPayments = function () {
    return $scope.payments.length;
  };

  $scope.displayActiveStatus = function (status) {
    return status === 'Active';
  };

  $scope.createPayment = function () {
    $scope.errorMessage = '';
    $scope.errorOccur = false;
    $scope.newPayment.companyId = JSON.parse($cookies.get('userCompany'))._id;
    PayTypesSvc.createType($scope.newPayment).success(function (type, status) {
      if (status === 200) {
        swal('Created!', 'Payment ' + type.code + ' created.', 'success');
        $scope.reset();
        getAllPayments();
      } else {
        $scope.errorOccur = true;
        $scope.errorMessage = (type.message) ? type.message : 'Internal server error!';
      }
    }).error(function (error) {
      $scope.errorOccur = true;
      $scope.errorMessage = (error.message) ? error.message : 'Internal server error!';
    });
  };

  var validateObject = function () {
    var keys = Object.keys($scope.newPayment);
    for (var x = 0; x < keys.length; x++) {
      if ($scope.newPayment.hasOwnProperty(keys[x])) {
        if (!$scope.newPayment[keys[x]]) {
          return false;
        }
      }
    }
    return true;
  };

  var validateObjectId = function () {
    for (var x = 0; x < $scope.payments.length; x++) {
      if ($scope.newPayment.code === $scope.payments[x].code) {
        return false;
      }
    }
    return true;
  };

  $scope.validate = function () {
    return validateObject() && validateObjectId();
  };



  $scope.removePayment = function(payment) {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + payment.title + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      PayTypesSvc.deleteType(payment._id).success(function (data) {
        swal('Deleted!', 'Payment ' + payment.code + ' deleted.', 'success');
        getAllPayments();
      }).error(function (error) {
        console.log(error);
        swal('Error Occurred', error.message, 'warning');
      });
    });
  };

  $scope.editPayment = function (payment) {
    $scope.isEdit = true;
    angular.copy(payment, $scope.newPayment);
    angular.copy(payment, $scope.editPayment);
  };

  $scope.payTypeFormHeader = function () {
    return $scope.isEdit ? 'Edit ' + $scope.editPayment.code + ' Pay Type' : 'Create new Pay Type';
  };
  
  $scope.validateEdit = function () {
    var keys = Object.keys($scope.newPayment);
    for (var x = 0; x < keys.length; x++) {
      if ($scope.newPayment.hasOwnProperty(keys[x]) && keys[x] !== '__v') {
        if (!$scope.newPayment[keys[x]] || $scope.newPayment[keys[x]] === '') {
          return true;
        }
      }
    }
    for (var y = 0; y < $scope.payments.length; y++) {
      if ($scope.payments[y].code === $scope.newPayment.code && $scope.payments[y]._id !== $scope.newPayment._id) {
        return true;
      }
    }
    return false;
  };
  
  $scope.updateType = function () {
    $scope.errorMessage = '';
    $scope.errorOccur = false;
    PayTypesSvc.updateType($scope.newPayment).success(function (type, status) {
      if (status === 200) {
        // show toast
        swal('Updated!', 'Payment ' + type.code + ' updated.', 'success');
        $scope.reset();
        getAllPayments();
      } else {
        $scope.errorOccur = true;
        $scope.errorMessage = (type.message) ? type.message : 'Internal server error!';
      }
    }).error(function (error) {
      $scope.errorOccur = true;
      $scope.errorMessage = (error.message) ? error.message : 'Internal server error!';
    });
  }


}]);








