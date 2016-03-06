'use strict';

/**
 * @ngdoc overview
 * @name chainAngularApp
 * @description
 * # BulkPay App
 *
 * Main module of the application.
 */


var bulkPay = angular.module('bulkPay', [
  'ui.router',
  'ngCookies',
  'ngStorage',
  'ng-sortable',
  'ui.bootstrap',
  'toastr',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'angularFileUpload',
  'xeditable',
  'rt.select2'
]);

bulkPay.run(function (select2Config) {
  select2Config.minimumResultsForSearch = 1;
  select2Config.dropdownAutoWidth = true;
});

bulkPay.factory('imageUploader', ['$upload', function($upload) {
  return {
    imageUpload: function(file) {
      return $upload.upload({
        url: '/api/employees/photo',
        file: file
      });
    }
  };
}]);

bulkPay.run(function($rootScope, $state, AuthSvc) {
  // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
  $rootScope.$on('$stateChangeStart', function(event, next) {

    if (next.name === 'signup' || next.name === 'login') {
      AuthSvc.isLoggedIn(function (status) {
        // console.log(status);
      });
    }
    /*var authenticate = next.authenticate;
    if (authenticate) {
      return;
    }

    if (authenticate) {

    }
*/
    /*if (typeof next.authenticate === 'string') {
      Auth.hasRole(next.authenticate, _.noop).then(has => {
        if (has) {
          return;
        }

        event.preventDefault();
      return Auth.isLoggedIn(_.noop).then(is => {
          $state.go(is ? 'main' : 'login');
    });
    });
    } else {
      Auth.isLoggedIn(_.noop).then(is => {
        if (is) {
          return;
        }

        event.preventDefault();
      $state.go('main');
    });
    }*/
  });
});

bulkPay.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

bulkPay.directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  }
});

bulkPay.directive('updateTitle', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
  return {
    link: function (scope, element) {
      var listener = function (event, toState) {
        var title = 'Home | course.ng';
        if (toState.data && toState.data.pageTitle) {
          title = toState.data.pageTitle;
        }
        $timeout(function () {
          element.text(title);
        }, 0, false);
      };
      $rootScope.$on('$stateChangeSuccess', listener);
    }
  };
}]);

bulkPay.filter('filterInput', function () {
  return function (input, filerObject) {
    var out = [];
    var key = '';
    if (input instanceof Array && input.length > 0) {
      if (filerObject.type === 'Department') {
        key = 'departmentId';
      } else {
        key = 'jobLevelId';
      }
      _.each(input, function (element) {
        if (element[key] === filerObject.value) {
          out.push(element);
        }
      });
    } else {
      out = input;
    }
    return out;
  }
});

bulkPay.filter('customTypesFilter', function () {
  return function (input, masterArray) {
    var out = [];
    _.each(input, function (element) {
      if (!_.find(masterArray, function (type) { return type.code === element.code })) {
        out.push(element);
      }
    });
    return out;
  }
});

bulkPay.filter('prettifyActivity', function () {
  return function (filterObject) {
    switch (filterObject.event) {
      case 'changed':
        return filterObject.event + ' ' + filterObject.referenceKey + ' ' + 'from ' + filterObject.oldValue + ' to ' + filterObject.newValue;
    }
  }
});

