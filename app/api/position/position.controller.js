/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/positions              ->  index
 * POST    /api/positions              ->  create
 * GET     /api/positions/:id          ->  show
 * PUT     /api/positions/:id          ->  update
 * DELETE  /api/positions/:id          ->  destroy
 */

'use strict';

require('../user/user.model.js');
require('./position.model.js');
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Position = mongoose.model('Position'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all positions
 */
exports.index = function (req, res) {
  Position.find({}, function (error, positions) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (positions) {
      crudHelper.respondWithResult(res, null, positions);
    }
  });
};

/**
 * Get all positions per business
 */
exports.positions = function (req, res) {
  Position.find({ businessId: req.params.id }, function (error, positions) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (positions) {
      crudHelper.respondWithResult(res, null, positions);
    }
  });
};

/*
 * Create new position
 * */
exports.create = function (req, res) {
  var newPosition = new Position(req.body);
  newPosition.save(function (error, position) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, position);
    }
  });
};

/*
 * Fetch a position
 * */
exports.show = function (req, res) {
  Position.findOne({ _id: req.params.id }, function (error, position) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (position) {
      crudHelper.respondWithResult(res, null, position);
    } else {
      crudHelper.handleError(res, null, { message: 'Position not found!' });
    }
  });
};

/*
 * Update single position
 * */
exports.updatePosition = function (req, res) {
  Position.findOne({ _id: req.params.id }, function (error, position) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, position, true);
    }
  });
};

exports.destroy = function (req, res) {
  Position.findOne({_id: req.params.id}, function (error, position) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (position) {
      crudHelper.handleEntityNotFound(req, res, position, false);
    }
  });
};