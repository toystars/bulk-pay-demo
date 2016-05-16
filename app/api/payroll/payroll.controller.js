/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/payrolls              ->  index
 * POST    /api/payrolls              ->  create
 * GET     /api/payrolls/:id          ->  show
 * PUT     /api/payrolls/:id          ->  update
 * DELETE  /api/payrolls/:id          ->  destroy
 */
'use strict';

require('./payroll.model.js');
require('../payrun/payrun.model.js');
var mongoose = require('mongoose'),
  PayRoll = mongoose.model('PayRoll'),
  PayRun = mongoose.model('PayRun'),
  _ = require('underscore'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all pay rolls
 */
exports.index = function (req, res) {
  PayRoll.find({}, function (error, docs) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (docs) {
      crudHelper.respondWithResult(res, null, docs);
    }
  });
};


/**
 * Get all pay rolls per pay roll
 */
exports.payrolls = function (req, res) {

  PayRoll.find({payRunId: req.params.payRunId}).populate('employee payGroup position pensionManager').exec(function (error, docs) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (docs) {
      crudHelper.respondWithResult(res, null, docs);
    }
  });
};

/*
 * Create new pay roll
 * */
exports.create = function (req, res) {

  var start = new Date(new Date().getFullYear(), 0, 1); // get first day of current year
  var end = new Date(); // current date

  PayRoll.findOne({
    employee: req.body.employee,
    createdAt: {"$gte": start, "$lte": end}
  }).sort({createdAt: -1}).exec(function (error, payRoll) {
    if (!error) {
      req.body.YTD = {
        gross: payRoll ? payRoll.YTD.gross + req.body.grossPay : req.body.grossPay,
        net: payRoll ? payRoll.YTD.net + req.body.netPay : req.body.netPay,
        tax: payRoll ? payRoll.YTD.tax + req.body.tax : req.body.tax
      };
      var newPayRoll = new PayRoll(req.body);
      newPayRoll.save(function (error, doc) {
        console.log(error);
        if (error) {
          crudHelper.handleError(res, 400, error);
        } else {
          PayRoll.findOne({_id: doc._id}).populate('employee payGroup position pensionManager').exec(function (error, payRoll) {
            if (error) {
              crudHelper.handleError(res, null, error);
            }
            if (payRoll) {
              crudHelper.respondWithResult(res, 201, payRoll);
            }
          });
        }
      });
    }
  });
};


/*
 * Fetch an pay run
 * */
exports.show = function (req, res) {
  PayRoll.findOne({_id: req.params.id}, function (error, doc) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (doc) {
      crudHelper.respondWithResult(res, null, doc);
    } else {
      crudHelper.handleError(res, null, {message: 'Pay roll not found!'});
    }
  });
};


/*
 * Get filtered employee payrolls
 * */
exports.filteredEmployeePayRolls = function (req, res) {
  var employeeId = req.params.employeeId;
  var payRolls = [];
  PayRun.find(req.body, function (error, payRuns) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (payRuns && payRuns.length > 0) {
      _.each(payRuns, function (payRun, payRunIndex) {
        PayRoll.findOne({ employee: employeeId, payRunId: payRun._id }).populate('employee payGroup position pensionManager').exec(function (error, payRoll) {
          if (error) {
            crudHelper.handleError(res, null, error);
          } else {
            payRoll.payRun = payRun;
            payRolls.push(payRoll);
            if (payRunIndex === payRuns.length - 1) {
              crudHelper.respondWithResult(res, null, payRolls);
            }
          }
        });
      });
    } else {
      crudHelper.respondWithResult(res, null, payRolls);
    }
  });
};
