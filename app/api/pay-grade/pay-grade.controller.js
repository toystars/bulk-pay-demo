/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/paygrades              ->  index
 * POST    /api/paygrades              ->  create
 * GET     /api/paygrades/:id          ->  show
 * PUT     /api/paygrades/:id          ->  update
 * DELETE  /api/paygrades/:id          ->  destroy
 */

'use strict';

require('./pay-grade.model.js');
var mongoose = require('mongoose'),
  PayGrade = mongoose.model('PayGrade'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all pay grades
 */
exports.index = function (req, res) {
  PayGrade.find({}, function (error, payGrades) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (payGrades) {
      crudHelper.respondWithResult(res, null, payGrades);
    }
  });
};

/**
 * Get all pay grades per business
 */
exports.payGrades = function (req, res) {
  PayGrade.find({ businessId: req.params.id }, function (error, payGrades) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (payGrades) {
      crudHelper.respondWithResult(res, null, payGrades);
    }
  });
};

/*
 * Create new pay grade
 * */
exports.create = function (req, res) {
  var newPayGrade = new PayGrade(req.body);
  newPayGrade.save(function (error, payGrade) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, payGrade);
    }
  });
};

/*
 * Fetch a pay grade
 * */
exports.show = function (req, res) {
  PayGrade.findOne({ _id: req.params.id }, function (error, payGrade) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (payGrade) {
      crudHelper.respondWithResult(res, null, payGrade);
    } else {
      crudHelper.handleError(res, null, { message: 'Pay grade not found!' });
    }
  });
};


/*
 * Fetch by pay group id
 * */
exports.getByPayGroup = function (req, res) {
  PayGrade.find({ payGroupId: req.params.payGroupId }, function (error, payGrades) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (payGrades) {
      crudHelper.respondWithResult(res, null, payGrades);
    } else {
      crudHelper.handleError(res, null, { message: 'No pay grade found!' });
    }
  });
};


/*
 * Update single pay grade
 * */
exports.updatePayGrade = function (req, res) {
  PayGrade.findOne({ _id: req.params.id }, function (error, payGrade) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, payGrade, true);
    }
  });
};

exports.destroy = function (req, res) {
  PayGrade.findOne({_id: req.params.id}, function (error, payGrade) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (payGrade) {
      crudHelper.handleEntityNotFound(req, res, payGrade, false);
    }
  });
};