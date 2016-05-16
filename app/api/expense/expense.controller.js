/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/expense              ->  index
 * POST    /api/expense              ->  create
 * GET     /api/expense/:id          ->  show
 * PUT     /api/expense/:id          ->  update
 * DELETE  /api/expense/:id          ->  destroy
 */

'use strict';

require('./expense.model.js');
var mongoose = require('mongoose'),
  Expense = mongoose.model('Expense'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all expenses
 */
exports.index = function (req, res) {
  Expense.find({}, function (error, expenses) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (times) {
      crudHelper.respondWithResult(res, null, expenses);
    }
  });
};


/**
 * Get all positions per business
 */
exports.businessExpenses = function (req, res) {
  Expense.find({ businessId: req.params.businessId }, function (error, expenses) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (times) {
      crudHelper.respondWithResult(res, null, expenses);
    }
  });
};


/*
 * Get all employee times
 * */
exports.employeeExpenses = function (req, res) {
  Expense.find({ employeeId: req.params.employeeId }).populate('employee').exec(function (error, expenses) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 200, expenses);
    }
  });
};


/*
 * Create new time
 * */
exports.create = function (req, res) {
  var newExpense = new Expense(req.body);
  newExpense.save(function (error, expense) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, expense);
    }
  });
};


/*
 * Fetch a position
 * */
exports.show = function (req, res) {
  Expense.findOne({ _id: req.params.id }, function (error, expense) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (expense) {
      crudHelper.respondWithResult(res, null, expense);
    } else {
      crudHelper.handleError(res, null, { message: 'Expense not found!' });
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


/*
 * Mark time record as sent
 * */
exports.send = function (req, res) {
  Expense.findOne({ _id: req.params.id }, function (error, expense) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      expense.status = 'Sent';
      expense.save(function (error, newExpense) {
        if (error) {
          crudHelper.handleError(res, null, error);
        } else {
          crudHelper.respondWithResult(res, 200, newExpense);
        }
      });
    }
  });
};


/*
 * Mark expense as serviced
 * */
exports.serviceExpense = function (req, res) {
  Expense.findOne({ _id: req.params.id }, function (error, expense) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      expense.serviced = true;
      expense.save(function (error, newExpense) {
        if (error) {
          crudHelper.handleError(res, null, error);
        } else {
          crudHelper.respondWithResult(res, 200, newExpense);
        }
      });
    }
  });
};


/*
 * Get filtered employee expenses
 * */
exports.filteredEmployeeExpenses = function (req, res) {
  Expense.find(req.body).populate('employee approvedBy').exec(function (error, expenses) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (expenses) {
      crudHelper.respondWithResult(res, null, expenses);
    }
  });
};


/*
 * Delete a time record
 * */
exports.delete = function (req, res) {
  Expense.remove({_id: req.params.id}, function (error, removedExpense) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 200, removedExpense);
    }
  });
};
