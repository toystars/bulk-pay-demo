/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/paymentrules              ->  index
 * POST    /api/paymentrules              ->  create
 * GET     /api/paymentrules/:id          ->  show
 * PUT     /api/paymentrules/:id          ->  update
 * DELETE  /api/paymentrules/:id          ->  destroy
 */

'use strict';

require('./payment-rule.model.js');
var mongoose = require('mongoose'),
  PaymentRule = mongoose.model('PaymentRule'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all payment rule
 */
exports.index = function (req, res) {
  PaymentRule.find({}, function (error, paymentRules) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (paymentRules) {
      crudHelper.respondWithResult(res, null, paymentRules);
    }
  });
};

/**
 * Get all payment rule per business
 */
exports.paymentRules = function (req, res) {
  PaymentRule.find({ businessId: req.params.id }, function (error, paymentRules) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (paymentRules) {
      crudHelper.respondWithResult(res, null, paymentRules);
    }
  });
};

/*
 * Create new payment rule
 * */
exports.create = function (req, res) {
  var newPaymentRule = new PaymentRule(req.body);
  newPaymentRule.save(function (error, paymentRule) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, paymentRule);
    }
  });
};

/*
 * Fetch a payment rule
 * */
exports.show = function (req, res) {
  PaymentRule.findOne({ _id: req.params.id }, function (error, paymentRule) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (paymentRule) {
      crudHelper.respondWithResult(res, null, paymentRule);
    } else {
      crudHelper.handleError(res, null, { message: 'Payment rule not found!' });
    }
  });
};

/*
 * Update single payment rule
 * */
exports.update = function (req, res) {
  PaymentRule.findOne({ _id: req.params.id }, function (error, paymentRule) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, paymentRule, true);
    }
  });
};

/*
* Delete payment rule
* */
exports.destroy = function (req, res) {
  PaymentRule.findOne({_id: req.params.id}, function (error, paymentRule) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (paymentRule) {
      crudHelper.handleEntityNotFound(req, res, paymentRule, false);
    }
  });
};