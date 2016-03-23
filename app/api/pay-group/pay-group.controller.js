/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/paygroups              ->  index
 * POST    /api/paygroups              ->  create
 * GET     /api/paygroups/:id          ->  show
 * PUT     /api/paygroups/:id          ->  update
 * DELETE  /api/paygroups/:id          ->  destroy
 */

'use strict';

require('./pay-group.model.js');
var mongoose = require('mongoose'),
  PayGroup = mongoose.model('PayGroup'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all pay groups
 */
exports.index = function (req, res) {
  PayGroup.find({}).populate('tax pension').exec(function (error, payGroups) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (payGroups) {
      crudHelper.respondWithResult(res, null, payGroups);
    }
  });
};

/**
 * Get all pay groups per business
 */
exports.payGroups = function (req, res) {
  PayGroup.find({ businessId: req.params.id }, function (error, payGroups) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (payGroups) {
      crudHelper.respondWithResult(res, null, payGroups);
    }
  });
};

/*
 * Create new pay group
 * */
exports.create = function (req, res) {
  var newPayGroup = new PayGroup(req.body);
  newPayGroup.save(function (error, payGroup) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, payGroup);
    }
  });
};

/*
 * Fetch a pay group
 * */
exports.show = function (req, res) {
  PayGroup.findOne({ _id: req.params.id }).populate('tax pension').exec(function (error, payGroup) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (payGroup) {
      crudHelper.respondWithResult(res, null, payGroup);
    } else {
      crudHelper.handleError(res, null, { message: 'Pay group not found!' });
    }
  });
};

/*
 * Update single pay group
 * */
exports.updatePayGroup = function (req, res) {
  PayGroup.findOne({ _id: req.params.id }, function (error, payGroup) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, payGroup, true);
    }
  });
};

exports.destroy = function (req, res) {
  PayGroup.findOne({_id: req.params.id}, function (error, payGroup) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (payGroup) {
      crudHelper.handleEntityNotFound(req, res, payGroup, false);
    }
  });
};