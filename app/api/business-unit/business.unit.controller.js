/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/businessunits              ->  index
 * POST    /api/businessunits              ->  create
 * GET     /api/businessunits/:id          ->  show
 * PUT     /api/businessunits/:id          ->  update
 * DELETE  /api/businessunits/:id          ->  destroy
 */

'use strict';

require('../user/user.model.js');
require('./business.unit.model.js');
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  BusinessUnit = mongoose.model('BusinessUnit'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all businessunits
 */
exports.index = function (req, res) {
  BusinessUnit.find({}, function (error, businessUnits) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (businessUnits) {
      crudHelper.respondWithResult(res, null, businessUnits);
    }
  });
};

/**
 * Get all businessunits per business
 */
exports.businessUnits = function (req, res) {
  BusinessUnit.find({ businessId: req.params.id }, function (error, businessUnits) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (businessUnits) {
      crudHelper.respondWithResult(res, null, businessUnits);
    }
  });
};

/*
 * Create new businessunit
 * */
exports.create = function (req, res) {
  var newBusinessUnit = new BusinessUnit(req.body);
  newBusinessUnit.save(function (error, businessUnit) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, businessUnit);
    }
  });
};

/*
 * Fetch a businessUnit
 * */
exports.show = function (req, res) {
  BusinessUnit.findOne({ _id: req.params.id }, function (error, businessUnit) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (businessUnit) {
      crudHelper.respondWithResult(res, null, businessUnit);
    } else {
      crudHelper.handleError(res, null, { message: 'Business Unit not found!' });
    }
  });
};

/*
 * Update single business
 * */
exports.updateBusinessUnit = function (req, res) {
  BusinessUnit.findOne({ _id: req.params.id }, function (error, businessUnit) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, businessUnit, true);
    }
  });
};


exports.destroy = function (req, res) {
  BusinessUnit.findOne({_id: req.params.id}, function (error, businessUnit) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (businessUnit) {
      crudHelper.handleEntityNotFound(req, res, businessUnit, false);
    }
  });
};
