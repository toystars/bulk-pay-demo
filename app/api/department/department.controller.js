/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/departments              ->  index
 * POST    /api/departments              ->  create
 * GET     /api/departments/:id          ->  show
 * PUT     /api/departments/:id          ->  update
 * DELETE  /api/departments/:id          ->  destroy
 */

'use strict';

require('../user/user.model.js');
require('./department.model.js');
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Department = mongoose.model('Department'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all divisions
 */
exports.index = function (req, res) {
  Department.find({}, function (error, departments) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (departments) {
      crudHelper.respondWithResult(res, null, departments);
    }
  });
};

/**
 * Get all divisions per business
 */
exports.departments = function (req, res) {
  Department.find({ businessId: req.params.id }, function (error, departments) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (departments) {
      crudHelper.respondWithResult(res, null, departments);
    }
  });
};

/*
 * Create new division
 * */
exports.create = function (req, res) {
  var newDepartment = new Department(req.body);
  newDepartment.save(function (error, department) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, department);
    }
  });
};

/*
 * Fetch a division
 * */
exports.show = function (req, res) {
  Department.findOne({ _id: req.params.id }, function (error, department) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (department) {
      crudHelper.respondWithResult(res, null, department);
    } else {
      crudHelper.handleError(res, null, { message: 'Division not found!' });
    }
  });
};

/*
 * Update single division
 * */
exports.updateDepartment = function (req, res) {
  Department.findOne({ _id: req.params.id }, function (error, department) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, department, true);
    }
  });
};

exports.destroy = function (req, res) {
  Department.findOne({_id: req.params.id}, function (error, department) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (department) {
      crudHelper.handleEntityNotFound(req, res, department, false);
    }
  });
};