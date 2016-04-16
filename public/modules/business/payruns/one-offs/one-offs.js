bulkPay.controller('BusinessOneOffCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', '$timeout', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state, $timeout) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.$parent.inView = 'One Off Payments';
  var businessId = '';
  $scope.options = {
    placeholder: "Choose One"
  };
  $scope.oneOfffs = [];
  $scope.employees = [];
  $scope.selectOneOffs = [];
  $scope.currentPayGrade = {};
  $scope.oneOff = {};

  jQuery('.toggle').toggles({on: true});

  var resetOneOff = function () {
    $scope.oneOff = {
      businessId: businessId,
      description: '',
      id: '',
      employee: '',
      customTitle: '',
      payment: {}
    };
    $scope.selectOneOffs = [];
  };

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getOneOffPayments = function (businessId) {
    $http.get('/api/oneoffs/business/' + businessId).success(function (oneOffs) {
      $scope.oneOfffs = oneOffs;
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    })
  };

  var getEmployees = function (businessId) {
    $http.get('/api/employees/business/' + businessId).success(function (employees) {
      $scope.employees = employees;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


  /*
   * Event Listeners
   * */

  $rootScope.$on('business.fetched', function (event, args) {
    $scope.business = args;
    businessId = args._id;
    getEmployees(businessId);
    getOneOffPayments(businessId);
    resetOneOff();
  });


  /*
   * Helpers
   * */

  var replace = function (newOneOff) {
    for (var x = 0; x < $scope.oneOfffs.length; x++) {
      if ($scope.oneOfffs[x]._id === newOneOff._id) {
        $scope.oneOfffs[x] = newOneOff;
        break;
      }
    }
  };

  var getEmployeePosition = function (employeeId) {
    return _.find($scope.employees, function (employee) {
      return employee._id === employeeId;
    }).positionId;
  };

  $scope.isCustom = function () {
    if ($scope.oneOff.payment) {
      return $scope.oneOff.payment.id !== 'custom';
    }
  };

  $scope.getOneOffTitle = function (oneOff) {
    return oneOff.payment.id === 'custom' ? oneOff.customTitle : oneOff.payment.title;
  };

  $scope.servicePayment = function (oneOff) {
    $http.put('/api/oneoffs/' + oneOff._id + '/service').success(function (data) {
      replace(data);
    });
  };

  $scope.fetchPayGrade = function () {
    $scope.selectOneOffs = [];
    $http.get('/api/paygrades/position/' + getEmployeePosition($scope.oneOff.employee)).success(function (data) {
      $scope.selectOneOffs.push({
        title: 'Custom',
        id: 'custom',
        value: 0
      });
      _.each(data.payTypes, function (type) {
        if (type.type === 'One Off') {
          $scope.selectOneOffs.push({
            title: type.title,
            id: type._id,
            value: type.value
          });
        }
      });
    });
  };

  $scope.setPayment = function () {
    $scope.oneOff.payment = _.find($scope.selectOneOffs, function (select) {
      return select.id === $scope.oneOff.id;
    });
  };


  $scope.createOneOffPayment = function () {
    $scope.oneOff.customTitle = $scope.oneOff.payment.id !== 'custom' ? '' : $scope.oneOff.customTitle;
    $http.post('/api/oneoffs/', $scope.oneOff).success(function (oneOff) {
      $timeout(function() {
        $scope.oneOfffs.push(oneOff);
        jQuery('#new-on-off-close').click();
        resetOneOff();
        swal('Success', ' One Off created.', 'success');
      });
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };

  $scope.cancel = function () {
    resetOneOff();
  };


}]);

