/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/employees              ->  index
 * POST    /api/employees              ->  create
 * GET     /api/employees/:id          ->  show
 * PUT     /api/employees/:id          ->  update
 * DELETE  /api/employees/:id          ->  destroy
 */

'use strict';

require('./employee.model.js');
var mongoose = require('mongoose'),
  Employee = mongoose.model('employee'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all employees
 */
exports.index = function (req, res) {
  Employee.find({}, function (error, employees) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (employees) {
      crudHelper.respondWithResult(res, null, employees);
    }
  });
};

/**
 * Get all employees per business
 */
exports.employees = function (req, res) {
  Employee.find({ businessId: req.params.id }, function (error, employees) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (employees) {
      crudHelper.respondWithResult(res, null, employees);
    }
  });
};

/*
 * Create new employee
 * */
exports.create = function (req, res) {
  var newEmployee = new Employee(req.body);
  newEmployee.save(function (error, employee) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, employee);
    }
  });
};

/*
 * Fetch an employee
 * */
exports.show = function (req, res) {
  Employee.findOne({ _id: req.params.id }, function (error, employee) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (employee) {
      crudHelper.respondWithResult(res, null, employee);
    } else {
      crudHelper.handleError(res, null, { message: 'Employee not found!' });
    }
  });
};


/*
 * Fetch by pay group id
 * */
exports.getByPayGroup = function (req, res) {
  Employee.find({ payGroupId: req.params.payGroupId }, function (error, employees) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (employees) {
      crudHelper.respondWithResult(res, null, employees);
    } else {
      crudHelper.handleError(res, null, { message: 'No employee found!' });
    }
  });
};


/*
 * Update single employee
 * */
exports.updateEmployee = function (req, res) {
  Employee.findOne({ _id: req.params.id }, function (error, employee) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, employee, true);
    }
  });
};

exports.destroy = function (req, res) {
  Employee.findOne({_id: req.params.id}, function (error, employee) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (employee) {
      crudHelper.handleEntityNotFound(req, res, employee, false);
    }
  });
};