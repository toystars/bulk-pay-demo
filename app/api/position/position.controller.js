/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/positions              ->  index
 * POST    /api/positions              ->  create
 * GET     /api/positions/:id          ->  show
 * PUT     /api/positions/:id          ->  update
 * DELETE  /api/positions/:id          ->  destroy
 */

'use strict';

require('../user/user.model.js');
require('./position.model.js');
require('../business-unit/business.unit.model.js');
require('../division/division.model.js');
require('../department/department.model.js');
require('../employee/employee.model.js');
require('../pay-group/pay-group.model.js');
require('../pay-grade/pay-grade.model.js');
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Position = mongoose.model('Position'),
  crudHelper = require('../../helpers/crud.js'),
  BusinessUnit = mongoose.model('BusinessUnit'),
  Division = mongoose.model('Division'),
  Department = mongoose.model('Department'),
  Employee = mongoose.model('Employee'),
  PayGroup = mongoose.model('PayGroup'),
  PayGrade = mongoose.model('PayGrade');


/**
 * Get all positions
 */
exports.index = function (req, res) {
  Position.find({}, function (error, positions) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (positions) {
      crudHelper.respondWithResult(res, null, positions);
    }
  });
};

/**
 * Get all positions per business
 */
exports.positions = function (req, res) {
  Position.find({ businessId: req.params.id }, function (error, positions) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (positions) {
      crudHelper.respondWithResult(res, null, positions);
    }
  });
};

/*
 * Create new position
 * */
exports.create = function (req, res) {
  var newPosition = new Position(req.body);
  newPosition.save(function (error, position) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, position);
    }
  });
};

/*
 * Fetch a position
 * */
exports.show = function (req, res) {
  Position.findOne({ _id: req.params.id }, function (error, position) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (position) {
      crudHelper.respondWithResult(res, null, position);
    } else {
      crudHelper.handleError(res, null, { message: 'Position not found!' });
    }
  });
};

/*
 * Update single position
 * */
exports.updatePosition = function (req, res) {
  Position.findOne({ _id: req.params.id }, function (error, position) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, position, true);
    }
  });
};

/*
 * Get additional info of single employee in position
 * */
exports.positionEmployee = function (req, res) {
  var newEmployee = {};
  Employee.findOne({ _id: req.params.employeeId }, function (error, employee) {
    BusinessUnit.findOne({ _id: employee.businessUnitId }, function (error, businessUnit) {
      newEmployee.businessUnitName = businessUnit ? businessUnit.name : '';
      Division.findOne({ _id: employee.divisionId }, function (error, division) {
        newEmployee.divisionName = division ? division.name : '';
        Department.findOne({ _id: employee.departmentId }, function (error, department) {
          newEmployee.departmentName = department ? department.name : '';
          PayGroup.findOne({ _id: employee.payGroupId }, function (error, payGroup) {
            newEmployee.payGroupName = payGroup ? payGroup.name : '';
            PayGrade.findOne({ _id: employee.payGradeId }, function (error, payGrade) {
              newEmployee.payGradeName = payGrade ? payGrade.name : '';
              Position.findOne({ _id: employee.positionId }, function (error, position) {
                newEmployee.positionName = position.name;
                if (position.parentPositionId) {
                  Employee.findOne({ positionId: position.parentPositionId }, function (error, supervisor) {
                    if (supervisor) {
                      newEmployee.supervisor = {
                        name: supervisor.fullName,
                        id: supervisor._id
                      };
                    }
                    crudHelper.respondWithResult(res, null, { newEmployee: newEmployee, oldEmployee: employee });
                  });
                } else {
                  crudHelper.respondWithResult(res, null, { newEmployee: newEmployee, oldEmployee: employee });
                }
              });
            });
          });
        });
      });
    });
  });
};


/*
* Remove a position
* */
exports.destroy = function (req, res) {
  Position.findOne({_id: req.params.id}, function (error, position) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (position) {
      crudHelper.handleEntityNotFound(req, res, position, false);
    }
  });
};