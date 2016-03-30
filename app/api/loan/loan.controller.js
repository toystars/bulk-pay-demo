/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/loans              ->  index
 * POST    /api/loans              ->  create
 * GET     /api/loans/:id          ->  show
 * PUT     /api/loans/:id          ->  update
 * DELETE  /api/loans/:id          ->  destroy
 */

'use strict';

require('./loan.model.js');
var mongoose = require('mongoose'),
  Loan = mongoose.model('Loan'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all loan
 */
exports.index = function (req, res) {
  Loan.find({}).populate('employee').exec(function (error, loans) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (loans) {
      crudHelper.respondWithResult(res, null, loans);
    }
  });
};

/**
 * Get all loans per business
 */
exports.loans = function (req, res) {
  Loan.find({ businessId: req.params.id }).populate('employee').exec(function (error, loans) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (loans) {
      crudHelper.respondWithResult(res, null, loans);
    }
  });
};

/*
 * Create new loan
 * */
exports.create = function (req, res) {
  var newLoan = new Loan(req.body);
  newLoan.save(function (error, loan) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      Loan.findOne({ _id: loan._id }).populate('employee').exec(function (error, loan) {
        if (error) {
          crudHelper.handleError(res, null, error);
        } else {
          crudHelper.respondWithResult(res, 201, loan);
        }
      });
    }
  });
};

/*
 * Fetch a loan
 * */
exports.show = function (req, res) {
  Loan.findOne({ _id: req.params.id }).populate('employee').exec(function (error, loan) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (loan) {
      crudHelper.respondWithResult(res, null, loan);
    } else {
      crudHelper.handleError(res, null, { message: 'Payment rule not found!' });
    }
  });
};

/*
 * Update single loan
 * */
exports.update = function (req, res) {
  Loan.findOne({ _id: req.params.id }, function (error, loan) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, loan, true);
    }
  });
};

/*
 * Make repayment update
 * */
exports.repayment = function (req, res) {
  Loan.findOne({ _id: req.params.id }, function (error, loan) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      var reqObject = req.body;
      loan.payCount = loan.payCount + 1;
      loan.activeAmount = reqObject.amountLeft;
      loan.fullyServiced = loan.activeAmount > 0 ? 'No' : 'Yes';
      loan.payments.push({
        interest: reqObject.interest,
        principal: reqObject.principal,
        payment: reqObject.payment,
        paymentPeriod: reqObject.paymentPeriod
      });
      loan.save(function (error, loan) {
        if (loan) {
          crudHelper.respondWithResult(res, null, loan);
        }
      });
    }
  });
};
