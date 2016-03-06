/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/pensions              ->  index
 * POST    /api/pensions              ->  create
 * GET     /api/pensions/:id          ->  show
 * PUT     /api/pensions/:id          ->  update
 * DELETE  /api/pensions/:id          ->  destroy
 */

'use strict';

require('./pension.model.js');
var mongoose = require('mongoose'),
  Pension = mongoose.model('Pension'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all pensions
 */
exports.index = function (req, res) {
  Pension.find({}, function (error, pensions) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (pensions) {
      crudHelper.respondWithResult(res, null, pensions);
    }
  });
};


/**
 * Get all pensions per business
 */
exports.pensions = function (req, res) {
  Pension.find({ businessId: req.params.id }, function (error, pensions) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (pensions) {
      crudHelper.respondWithResult(res, null, pensions);
    }
  });
};

/*
 * Create new pension
 * */
exports.create = function (req, res) {
  var newPension = new Pension(req.body);
  newPension.save(function (error, pension) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, pension);
    }
  });
};


/*
 * Fetch an pension
 * */
exports.show = function (req, res) {
  Pension.findOne({ _id: req.params.id }, function (error, pension) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (pension) {
      crudHelper.respondWithResult(res, null, pension);
    } else {
      crudHelper.handleError(res, null, { message: 'Pension not found!' });
    }
  });
};


/*
 * Update single employee
 * */
exports.update = function (req, res) {
  Pension.findOne({ _id: req.params.id }, function (error, pension) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, pension, true);
    }
  });
};

exports.destroy = function (req, res) {
  Pension.findOne({_id: req.params.id}, function (error, pension) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (pension) {
      crudHelper.handleEntityNotFound(req, res, pension, false);
    }
  });
};