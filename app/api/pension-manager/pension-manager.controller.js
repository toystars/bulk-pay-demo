/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/pensionmanagers              ->  index
 * POST    /api/pensionmanagers              ->  create
 * GET     /api/pensionmanagers/:id          ->  show
 * PUT     /api/pensionmanagers/:id          ->  update
 * DELETE  /api/pensionmanagers/:id          ->  destroy
 */

'use strict';

require('./pension-manager.model.js');
var mongoose = require('mongoose'),
  PensionManager = mongoose.model('PensionManager'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all pension managers
 */
exports.index = function (req, res) {
  PensionManager.find({}, function (error, pensionManagers) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (pensionManagers) {
      crudHelper.respondWithResult(res, null, pensionManagers);
    }
  });
};


/**
 * Get all pension managers per business
 */
exports.pensionManagers = function (req, res) {
  PensionManager.find({ businessId: req.params.id }, function (error, pensionManagers) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (pensionManagers) {
      crudHelper.respondWithResult(res, null, pensionManagers);
    }
  });
};

/*
 * Create new pension manager
 * */
exports.create = function (req, res) {
  var newPensionManager = new PensionManager(req.body);
  newPensionManager.save(function (error, pensionManager) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, pensionManager);
    }
  });
};


/*
 * Fetch a pension manager
 * */
exports.show = function (req, res) {
  PensionManager.findOne({ _id: req.params.id }, function (error, pensionManager) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (pensionManager) {
      crudHelper.respondWithResult(res, null, pensionManager);
    } else {
      crudHelper.handleError(res, null, { message: 'Pension Manager not found!' });
    }
  });
};


/*
 * Update single pension manager
 * */
exports.update = function (req, res) {
  PensionManager.findOne({ _id: req.params.id }, function (error, pensionManager) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, pensionManager, true);
    }
  });
};

exports.destroy = function (req, res) {
  PensionManager.findOne({_id: req.params.id}, function (error, pensionManager) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (pensionManager) {
      crudHelper.handleEntityNotFound(req, res, pensionManager, false);
    }
  });
};