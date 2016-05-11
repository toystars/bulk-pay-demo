/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/leave              ->  index
 * POST    /api/leave              ->  create
 * GET     /api/leave/:id          ->  show
 * PUT     /api/leave/:id          ->  update
 * DELETE  /api/leave/:id          ->  destroy
 */

'use strict';

require('./leave.model.js');
var mongoose = require('mongoose'),
  Leave = mongoose.model('Leave'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all leaves
 */
exports.index = function (req, res) {
  Leave.find({}, function (error, leaves) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (leaves) {
      crudHelper.respondWithResult(res, null, leaves);
    }
  });
};


/**
 * Get all positions per business
 */
exports.businessLeaves = function (req, res) {
  Leave.find({ businessId: req.params.businessId }, function (error, leaves) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (leaves) {
      crudHelper.respondWithResult(res, null, leaves);
    }
  });
};


/*
 * Get all employee times
 * */
exports.employeeLeaves = function (req, res) {
  Leave.find({ employeeId: req.params.employeeId }).populate('approvedBy').exec(function (error, leaves) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 200, leaves);
    }
  });
};


/*
 * Create new time
 * */
exports.create = function (req, res) {
  var newLeave = new Leave(req.body);
  newLeave.save(function (error, leave) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      Leave.findOne({ _id: leave._id }).populate('approvedBy').exec(function (error, newLeave) {
        if (error) {
          crudHelper.handleError(res, null, error);
        } else if (newLeave) {
          crudHelper.respondWithResult(res, null, newLeave);
        } else {
          crudHelper.handleError(res, null, { message: 'Leave not found!' });
        }
      });
    }
  });
};


/*
 * Fetch a position
 * */
exports.show = function (req, res) {
  Leave.findOne({ _id: req.params.id }).populate('approvedBy').exec(function (error, leave) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (leave) {
      crudHelper.respondWithResult(res, null, leave);
    } else {
      crudHelper.handleError(res, null, { message: 'Leave not found!' });
    }
  });
};


/*
 * Update single position
 * */
exports.update = function (req, res) {
  Expense.findOne({ _id: req.params.id }, function (error, expense) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, expense, true);
    }
  });
};
