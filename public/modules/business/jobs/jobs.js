
bulkPay.controller('BusinessJobsCtrl', ['$scope', '$rootScope', 'AuthSvc', 'BusinessDataSvc', '$stateParams', '$cookies', '$http', '$state', function ($scope, $rootScope, AuthSvc, BusinessDataSvc, $stateParams, $cookies, $http, $state) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.positions = [];
  $scope.jobs = [];
  $scope.$parent.inView = 'Jobs';
  var businessId = '';
  $scope.options = {
    placeholder: "Choose One"
  };
  $scope.dataFetched = false;

  var resetJob = function () {
    $scope.job = {
      code: '',
      title: '',
      businessId: businessId,
      positionId: '',
      description: ''
    };
  };


  if (!BusinessDataSvc.getBusinessId() || BusinessDataSvc.getBusinessId() !== $stateParams.businessId) {
    $cookies.put('currentBusiness', $stateParams.businessId);
    BusinessDataSvc.setBusinessId();
  } else {
    BusinessDataSvc.setLocalScope();
  }

  var getJobs = function (businessId) {
    $http.get('/api/jobs/business/' + businessId).success(function (data) {
      $scope.jobs = data;
      $scope.dataFetched = true;
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


  var getPositions = function (businessId) {
    $http.get('/api/positions/business/' + businessId).success(function (data) {
      $scope.positions = data;
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
    getJobs(businessId);
    getPositions(businessId);
    resetJob();
  });


  $scope.createJob = function () {
    $http.post('/api/jobs/', $scope.job).success(function (data) {
      $scope.jobs.push(data);
      resetJob();
      jQuery('#new-job-close').click();
      swal("Success", "Job created.", "success");
    }).error(function (error) {
      console.log(error);
      AuthSvc.handleError(error);
    });
  };


  /*
   * Data
   * */
  $scope.statuses = ['Active', 'Inactive'];

  /*
   * Helpers
   * */

  var replace = function (data) {
    for (var x = 0; x < $scope.departments.length; x++) {
      if ($scope.departments[x]._id === data._id) {
        $scope.departments[x] = data;
      }
    }
  };

  var removeFromCollection = function (id) {
    for (var x = 0; x < $scope.departments.length; x++) {
      if ($scope.departments[x]._id === id) {
        $scope.departments.splice(x, 1);
      }
    }
  };

  var getHistories = function (objectId) {
    $http.get('/api/histories/object/' + objectId).success(function (data) {
      $scope.histories = data;
    }).error(function (error) {
      AuthSvc.handleError(error);
    });
  };


  /*
   * Single unit display
   * */
  $scope.singleView = false;
  $scope.filteredDepartments = [];

  $scope.showDepartment = function (department) {
    $scope.singleView = true;
    $scope.singleDepartment = {};
    $scope.oldDepartment = {};
    angular.copy(department, $scope.oldDepartment);
    angular.copy(department, $scope.singleDepartment);
    $scope.singleDepartment.parentId = $scope.singleDepartment.parent ? $scope.singleDepartment.parent._id : '';
    $scope.singleDepartment.divisionId = $scope.singleDepartment.division ? $scope.singleDepartment.division._id : '';
    getHistories($scope.singleDepartment._id);
    setParentsDepartments();
  };

  $scope.delete = function () {
    swal({
      title: 'Are you sure?',
      text: 'Deleting ' + $scope.singleDepartment.name + ' is irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      $http.delete('/api/departments/' + $scope.singleDepartment._id).success(function (data) {
        swal('Deleted!', $scope.singleDepartment.name + ' department deleted.', 'success');
        removeFromCollection($scope.singleDepartment._id);
        $scope.closeDivision();
      }).error(function (error) {
        AuthSvc.handleError(error);
        swal('Error Occurred', error.message, 'warning');
      });
    });
  };

  $scope.closeDivision = function () {
    $scope.singleDepartment = {};
    $scope.singleView = false;
    $scope.histories = [];
  };

  $scope.updateJob = function () {

  };


}]);

