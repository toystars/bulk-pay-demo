/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/histories              ->  index
 * POST    /api/histories              ->  create
 * GET     /api/histories/:id          ->  show
 * PUT     /api/histories/:id          ->  update
 * DELETE  /api/histories/:id          ->  destroy
 */

'use strict';

require('./history.model.js');
var mongoose = require('mongoose'),
  History = mongoose.model('History'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all histories
 */
exports.index = function (req, res) {
  History.find({}).populate('user').exec(function (error, histories) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (histories) {
      crudHelper.respondWithResult(res, null, histories);
    }
  });
};


/**
 * Get all histories
 */
exports.getByObject = function (req, res) {
  var objectId = req.params.id;
  History.find({ objectId: objectId }).populate('user').exec(function (error, histories) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (histories) {
      crudHelper.respondWithResult(res, null, histories);
    }
  });
};


/*
 * Fetch a history
 * */
exports.show = function (req, res) {
  var historyId = req.params.id;
  History.findOne({ _id: historyId }).populate('user').exec(function (error, history) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (history) {
      crudHelper.respondWithResult(res, null, history);
    } else {
      crudHelper.handleError(res, null, { message: 'History not found!' });
    }
  });
};

