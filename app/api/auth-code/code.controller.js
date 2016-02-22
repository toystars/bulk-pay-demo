/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/codes              ->  index
 * POST    /api/codes              ->  create
 * GET     /api/codes/:id          ->  show
 * PUT     /api/codes/:id          ->  update
 * DELETE  /api/codes/:id          ->  destroy
 */
var mongoose = require('mongoose');
require('./code.model.js');
var Code = mongoose.model('Code');
var crudHelper = require('../../helpers/crud.js');

// Gets a list of Codes
exports.index = function (req, res) {
  Code.find(function (error, codes) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else {
      crudHelper.respondWithResult(res, null, codes);
    }
  });
};

// Creates a new Code in the DB
exports.create = function (req, res) {
  var newCode = new Code(req.body);
  newCode.save(function (error, code) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, code);
    }
  });
};

// Gets a single Code from the DB
exports.show = function (req, res) {
  Code.findOne({_id: req.params.id}, function (error, code) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, code);
    }
  });
};

exports.update = function (req, res) {
  Code.findOne({_id: req.params.id}, function (error, code) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, code, true);
    }
  });
};

exports.destroy = function (req, res) {
  Code.findOne({_id: req.params.id}, function (error, code) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, code, false);
    }
  });
};
