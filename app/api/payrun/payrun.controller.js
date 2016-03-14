/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/payruns              ->  index
 * POST    /api/payruns              ->  create
 * GET     /api/payruns/:id          ->  show
 * PUT     /api/payruns/:id          ->  update
 * DELETE  /api/payruns/:id          ->  destroy
 */

'use strict';

require('./payrun.model.js');
var mongoose = require('mongoose'),
  PayRun = mongoose.model('PayRun'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all pay runs
 */
exports.index = function (req, res) {
  PayRun.find({}, function (error, payRuns) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (payRuns) {
      crudHelper.respondWithResult(res, null, payRuns);
    }
  });
};


/**
 * Get all pay runs per business
 */
exports.payruns = function (req, res) {
  PayRun.find({ businessId: req.params.id }, function (error, payRuns) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (payRuns) {
      crudHelper.respondWithResult(res, null, payRuns);
    }
  });
};

/*
 * Create new pay run
 * */
exports.create = function (req, res) {
  var newPayRun = new PayRun(req.body);
  newPayRun.save(function (error, payRun) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, payRun);
    }
  });
};


/*
 * Fetch an pay run
 * */
exports.show = function (req, res) {
  PayRun.findOne({ _id: req.params.id }, function (error, payRun) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (payRun) {
      crudHelper.respondWithResult(res, null, payRun);
    } else {
      crudHelper.handleError(res, null, { message: 'Pay run not found!' });
    }
  });
};


/*
 * Update single pay run
 * */
exports.update = function (req, res) {
  PayRun.findOne({ _id: req.params.id }, function (error, payRun) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, payRun, true);
    }
  });
};

exports.destroy = function (req, res) {
  PayRun.findOne({_id: req.params.id}, function (error, payRun) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (payRun) {
      crudHelper.handleEntityNotFound(req, res, payRun, false);
    }
  });
};