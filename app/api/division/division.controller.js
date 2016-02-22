/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/divisions              ->  index
 * POST    /api/divisions              ->  create
 * GET     /api/divisions/:id          ->  show
 * PUT     /api/divisions/:id          ->  update
 * DELETE  /api/divisions/:id          ->  destroy
 */

'use strict';

require('../user/user.model.js');
require('./division.model.js');
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Division = mongoose.model('Division'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all divisions
 */
exports.index = function (req, res) {
  Division.find({}, function (error, divisions) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (divisions) {
      crudHelper.respondWithResult(res, null, divisions);
    }
  });
};

/**
 * Get all divisions per business
 */
exports.divisions = function (req, res) {
  Division.find({ businessId: req.params.id }, function (error, divisions) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (divisions) {
      crudHelper.respondWithResult(res, null, divisions);
    }
  });
};

/*
 * Create new division
 * */
exports.create = function (req, res) {
  var newDivision = new Division(req.body);
  newDivision.save(function (error, division) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, division);
    }
  });
};

/*
 * Fetch a division
 * */
exports.show = function (req, res) {
  Division.findOne({ _id: req.params.id }, function (error, division) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (division) {
      crudHelper.respondWithResult(res, null, division);
    } else {
      crudHelper.handleError(res, null, { message: 'Division not found!' });
    }
  });
};

/*
 * Update single division
 * */
exports.updateDivision = function (req, res) {
  Division.findOne({ _id: req.params.id }, function (error, division) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, division, true);
    }
  });
};

exports.destroy = function (req, res) {
  Division.findOne({_id: req.params.id}, function (error, division) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (division) {
      crudHelper.handleEntityNotFound(req, res, division, false);
    }
  });
};

