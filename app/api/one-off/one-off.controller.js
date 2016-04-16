/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/oneoffs              ->  index
 * POST    /api/oneoffs              ->  create
 * GET     /api/oneoffs/:id          ->  show
 * PUT     /api/oneoffs/:id          ->  update
 * DELETE  /api/oneoffs/:id          ->  destroy
 */

'use strict';

require('./one-off.model.js');
var mongoose = require('mongoose'),
  OneOff = mongoose.model('OneOff'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all oneOffs
 */
exports.index = function (req, res) {
  OneOff.find({}).populate('position').exec(function (error, oneOffs) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (oneOffs) {
      crudHelper.respondWithResult(res, null, oneOffs);
    }
  });
};

/**
 * Get all oneOffs per business
 */
exports.oneoffs = function (req, res) {
  OneOff.find({ businessId: req.params.id }).populate('employee').exec(function (error, oneOffs) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (oneOffs) {
      crudHelper.respondWithResult(res, null, oneOffs);
    }
  });
};

/*
 * Create new oneOff
 * */
exports.create = function (req, res) {
  var newOneOff = new OneOff(req.body);
  newOneOff.save(function (error, oneOff) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      OneOff.findOne({ _id: oneOff._id }).populate('employee').exec(function (error, oneOff) {
        if (error) {
          crudHelper.handleError(res, null, error);
        } else {
          crudHelper.respondWithResult(res, 201, oneOff);
        }
      });
    }
  });
};

/*
 * Fetch a oneOff
 * */
exports.show = function (req, res) {
  OneOff.findOne({ _id: req.params.id }).populate('employee').exec(function (error, oneOff) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (oneOff) {
      crudHelper.respondWithResult(res, null, oneOff);
    } else {
      crudHelper.handleError(res, null, { message: 'One Off not found!' });
    }
  });
};

/*
 * Update single oneOff
 * */
exports.update = function (req, res) {
  OneOff.findOne({ _id: req.params.id }, function (error, oneOff) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, oneOff, true);
    }
  });
};


/**
 * Service one off payment
 */
exports.service = function (req, res) {
  OneOff.findOne({ _id: req.params.id }, function (error, oneOff) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      oneOff.serviced = 'Yes';
      oneOff.save(function (error, updatedOneOff) {
        OneOff.findOne({ _id: updatedOneOff._id }).populate('employee').exec(function (error, oneOff) {
          if (error) {
            crudHelper.handleError(res, null, error);
          }
          if (oneOff) {
            crudHelper.respondWithResult(res, null, oneOff);
          }
        });
      });
    }
  });
};

