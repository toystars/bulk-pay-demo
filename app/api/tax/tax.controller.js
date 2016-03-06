/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/taxes              ->  index
 * POST    /api/taxes              ->  create
 * GET     /api/taxes/:id          ->  show
 * PUT     /api/taxes/:id          ->  update
 * DELETE  /api/taxes/:id          ->  destroy
 */

'use strict';

require('./tax.model.js');
var mongoose = require('mongoose'),
  Tax = mongoose.model('Tax'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all taxes
 */
exports.index = function (req, res) {
  Tax.find({}, function (error, taxes) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (taxes) {
      crudHelper.respondWithResult(res, null, taxes);
    }
  });
};


/**
 * Get all taxes per business
 */
exports.taxes = function (req, res) {
  Tax.find({ businessId: req.params.id }, function (error, taxes) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (taxes) {
      crudHelper.respondWithResult(res, null, taxes);
    }
  });
};

/*
 * Create new employee
 * */
exports.create = function (req, res) {
  var newTax = new Tax(req.body);
  newTax.save(function (error, tax) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, tax);
    }
  });
};


/*
 * Fetch an employee
 * */
exports.show = function (req, res) {
  Tax.findOne({ _id: req.params.id }, function (error, tax) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (tax) {
      crudHelper.respondWithResult(res, null, tax);
    } else {
      crudHelper.handleError(res, null, { message: 'Tax not found!' });
    }
  });
};


/*
 * Update single employee
 * */
exports.update = function (req, res) {
  Tax.findOne({ _id: req.params.id }, function (error, tax) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, tax, true);
    }
  });
};

exports.destroy = function (req, res) {
  Tax.findOne({_id: req.params.id}, function (error, tax) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (tax) {
      crudHelper.handleEntityNotFound(req, res, tax, false);
    }
  });
};