
bulkPay.controller('BusinessPayGradesCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

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

  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getPayGrades = function (businessId) {
    $http.get('/api/paygrades/business/' + businessId).success(function (data) {
      $scope.payGrades = data;
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
      level: '',
      payGroupId: '',
      payTypes: []
    };
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
    resetPayGrade();
  });

  $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
    triggerSelect();
  });



  $scope.createPayGrade = function () {
    $http.post('/api/paygrades/', $scope.payGrade).success(function (data) {
      $scope.payGrades.push(data);
      jQuery('#new-pay-grade-close').click();
      resetPayGrade();
      swal('Success', ' Pay Grade created.', 'success');
    }).error(function (error) {
      console.log(error);
    });
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



  /*
   * Helpers
   * */

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

  $scope.showPayGroup = function (payGrade) {
    $scope.singleView = true;
    $scope.singlePayGrade = {};
    $scope.oldPayGrade = {};
    angular.copy(payGroup, $scope.oldPayGrade);
    angular.copy(payGroup, $scope.singlePayGrade);
    getHistories($scope.singlePayGrade._id);
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
      $http.delete('/api/paygroups/' + $scope.singlePayGrade._id).success(function (data) {
        swal('Deleted!', $scope.singlePayGrade.title + ' pay grade deleted.', 'success');
        removeFromCollection($scope.singlePayGrade._id);
        $scope.closePayGroup();
      }).error(function (error) {
        swal('Error Occurred', error.message, 'warning');
        console.log(error);
      });
    });
  };

  $scope.closePayGroup = function () {
    $scope.singlePayGrade = {};
    $scope.singleView = false;
    $scope.histories = [];
  };

  $scope.updatePayGroup = function () {
    $http.put('/api/paygroups/' + $scope.singlePayGrade._id, $scope.singlePayGrade).success(function (data) {
      getHistories(data._id);
      replace(data);
      swal("Success", "Pay grade updated.", "success");
    }).error(function (error) {
      console.log(error);
    });
  };


  /*
   * jQuery
   * */
  var triggerSelect = function () {
    jQuery('#pay-grade-pay-group').select2({
      minimumResultsForSearch: 0
    });
    jQuery('#pay-grade-status').select2({
      minimumResultsForSearch: 0
    });
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

