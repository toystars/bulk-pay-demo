/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/payrolls              ->  index
 * POST    /api/payrolls              ->  create
 * GET     /api/payrolls/:id          ->  show
 * PUT     /api/payrolls/:id          ->  update
 * DELETE  /api/payrolls/:id          ->  destroy
 */

'use strict';

require('./payroll.model.js');
var mongoose = require('mongoose'),
  PayRoll = mongoose.model('PayRoll'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all pay rolls
 */
exports.index = function (req, res) {
  PayRoll.find({}, function (error, docs) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (docs) {
      crudHelper.respondWithResult(res, null, docs);
    }
  });
};


/**
 * Get all pay rolls per pay roll
 */
exports.payrolls = function (req, res) {

  PayRoll.find({ payRunId: req.params.payRunId }).populate('employee').exec(function (error, docs) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (docs) {
      crudHelper.respondWithResult(res, null, docs);
    }
  });
};

/*
 * Create new pay roll
 * */
exports.create = function (req, res) {
  var newPayRoll = new PayRoll(req.body);
  newPayRoll.save(function (error, doc) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      PayRoll.findOne({ _id: doc._id }).populate('employee').exec(function (error, payRoll) {
        if (error) {
          crudHelper.handleError(res, null, error);
        }
        if (payRoll) {
          crudHelper.respondWithResult(res, 201, payRoll);
        }
      });
    }
  });
};


/*
 * Fetch an pay run
 * */
exports.show = function (req, res) {
  PayRoll.findOne({ _id: req.params.id }, function (error, doc) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (doc) {
      crudHelper.respondWithResult(res, null, doc);
    } else {
      crudHelper.handleError(res, null, { message: 'Pay roll not found!' });
    }
  });
};
