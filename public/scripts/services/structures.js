bulkPay.factory('StructureSvc', ['$http', '$cookies', function($http, $cookies){

  function StructureSvc () {

    var self = this;

    /*
    * Job Level section
    * */
    self.getCompanyJobLevels = function (companyId) {
      var req = {
        method: 'GET',
        url: '/api/joblevels/' + companyId
      };
      return $http(req);
    };

    self.createJobLevel = function (dataObject) {
      var req = {
        method: 'POST',
        url: '/api/joblevels',
        data: dataObject
      };
      return $http(req);
    };

    self.editJobLevel = function (dataObject) {
      var req = {
        method: 'PUT',
        url: '/api/joblevel/' + dataObject._id + '/' + dataObject.companyId,
        data: dataObject
      };
      return $http(req);
    };

    self.deleteJobLevel = function (jobLevelId, companyId) {
      var req = {
        method: 'DELETE',
        url: '/api/joblevel/' + jobLevelId + '/' + companyId
      };
      return $http(req);
    };
    /*
    * End Job Level section
    * */



    /*
    * Department section
    * */
    self.getAllDepartments = function () {
      var req = {
        method: 'GET',
        url: '/api/departments'
      };
      return $http(req);
    };

    self.getCompanyDepartments = function (companyId) {
      var req = {
        method: 'GET',
        url: '/api/departments/' + companyId
      };
      return $http(req);
    };

    self.createDepartment = function (dataObject) {
      var req = {
        method: 'POST',
        url: '/api/departments',
        data: dataObject
      };
      return $http(req);
    };

    self.editDepartment = function (dataObject) {
      var req = {
        method: 'PUT',
        url: '/api/department/' + dataObject._id + '/' + dataObject.companyId,
        data: dataObject
      };
      return $http(req);
    };

    self.deleteDepartment = function (departmentId, companyId) {
      var req = {
        method: 'DELETE',
        url: '/api/department/' + departmentId + '/' + companyId
      };
      return $http(req);
    };
    /*
    * End of Department section
    * */


    /*
     * Position section
     * */
    self.getAllPositions = function () {
      var req = {
        method: 'GET',
        url: '/api/positions'
      };
      return $http(req);
    };

    self.getCompanyPositions = function (companyId) {
      var req = {
        method: 'GET',
        url: '/api/positions/' + companyId
      };
      return $http(req);
    };

    self.createPosition = function (dataObject) {
      var req = {
        method: 'POST',
        url: '/api/positions',
        data: dataObject
      };
      return $http(req);
    };

    self.editPosition = function (dataObject) {
      var req = {
        method: 'PUT',
        url: '/api/position/' + dataObject._id + '/' + dataObject.companyId,
        data: dataObject
      };
      return $http(req);
    };

    self.deletePosition = function (departmentId, companyId) {
      var req = {
        method: 'DELETE',
        url: '/api/position/' + departmentId + '/' + companyId
      };
      return $http(req);
    };
    /*
     * End of Position section
     * */

  }

  return new StructureSvc();

}]);