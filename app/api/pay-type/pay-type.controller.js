/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/paytypes              ->  index
 * POST    /api/paytypes              ->  create
 * GET     /api/paytypes/:id          ->  show
 * PUT     /api/paytypes/:id          ->  update
 * DELETE  /api/paytypes/:id          ->  destroy
 */

'use strict';

require('../user/user.model.js');
require('./pay-type.model.js');
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  PayType = mongoose.model('PayType'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all pay types
 */
exports.index = function (req, res) {
  PayType.find({}, function (error, payTypes) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (payTypes) {
      crudHelper.respondWithResult(res, null, payTypes);
    }
  });
};

/**
 * Get all pay types per business
 */
exports.payTypes = function (req, res) {
  PayType.find({ businessId: req.params.id }, function (error, payTypes) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (payTypes) {
      crudHelper.respondWithResult(res, null, payTypes);
    }
  });
};

/*
 * Create new pay type
 * */
exports.create = function (req, res) {
  var newPayType = new PayType(req.body);
  newPayType.save(function (error, payType) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, payType);
    }
  });
};

/*
 * Fetch a pay type
 * */
exports.show = function (req, res) {
  PayType.findOne({ _id: req.params.id }, function (error, payType) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (payType) {
      crudHelper.respondWithResult(res, null, payType);
    } else {
      crudHelper.handleError(res, null, { message: 'Pay type not found!' });
    }
  });
};

/*
 * Update single pay type
 * */
exports.updatePayType = function (req, res) {
  PayType.findOne({ _id: req.params.id }, function (error, payType) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, payType, true);
    }
  });
};

exports.destroy = function (req, res) {
  PayType.findOne({_id: req.params.id}, function (error, payType) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (payType) {
      crudHelper.handleEntityNotFound(req, res, payType, false);
    }
  });
};