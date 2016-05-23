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
require('../employee/employee.model.js');
require('../position/position.model.js');
var mongoose = require('mongoose'),
  Leave = mongoose.model('Leave'),
  Position = mongoose.model('Position'),
  Employee = mongoose.model('Employee'),
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
 * Get all leave requests per business
 */
exports.businessLeaves = function (req, res) {
  Leave.find({ businessId: req.params.businessId }).populate('approvedBy employee').exec(function (error, leaves) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (leaves) {
      crudHelper.respondWithResult(res, null, leaves);
    }
  });
};


/*
 * Get filtered business leave requests
 * */
exports.filteredBusinessLeaves = function (req, res) {
  Leave.find(req.body).populate('employee approvedBy').exec(function (error, leaves) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (leaves) {
      crudHelper.respondWithResult(res, null, leaves);
    }
  });
};



/*
 * Mark leave as approved or declined
 * */
exports.approveLeave = function (req, res) {
  Leave.findOne({ _id: req.params.id }, function (error, leave) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      leave.approvalStatus = req.body.approvalStatus;
      leave.approvedBy = req.body.approvedBy;
      leave.save(function (error, newLeave) {
        if (error) {
          crudHelper.handleError(res, null, error);
        } else {
          crudHelper.respondWithResult(res, 200, newLeave);
        }
      });
    }
  });
};



/*
 * Get all employee leave requests
 * */
exports.employeeLeaves = function (req, res) {
  Leave.find({ employeeId: req.params.employeeId }).populate('approvedBy employee').exec(function (error, leaves) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 200, leaves);
    }
  });
};


/*
 * Create new leave
 * */
exports.create = function (req, res) {
  var newLeave = new Leave(req.body);
  newLeave.save(function (error, leave) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      Leave.findOne({ _id: leave._id }).populate('approvedBy employee').exec(function (error, newLeave) {
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
 * Fetch a leave record
 * */
exports.show = function (req, res) {
  Leave.findOne({ _id: req.params.id }).populate('approvedBy employee').exec(function (error, leave) {
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
 * Update single leave
 * */
exports.update = function (req, res) {
  Leave.findOne({ _id: req.params.id }, function (error, expense) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, expense, true);
    }
  });
};


/*
 * Mark leave record as sent
 * */
exports.send = function (req, res) {
  Leave.findOne({ _id: req.params.id }, function (error, leave) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      leave.status = 'Sent';
      leave.save(function (error, newLeave) {
        if (error) {
          crudHelper.handleError(res, null, error);
        } else {
          crudHelper.respondWithResult(res, 200, newLeave);
        }
      });
    }
  });
};


/*
 * Get filtered employee leaves
 * */
exports.filteredEmployeeLeaves = function (req, res) {
  Leave.find(req.body).populate('employee approvedBy').exec(function (error, leaves) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (leaves) {
      crudHelper.respondWithResult(res, null, leaves);
    }
  });
};



/*
 * Get employee position
 * */
exports.getEmployeePosition = function (req, res) {
  Employee.findOne({ _id: req.params.employeeId }, function (error, employee) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      Position.findOne({_id: employee.positionId}, function (error, position) {
        if (error) {
          crudHelper.handleError(res, 400, error);
        } else {
          crudHelper.respondWithResult(res, null, position);
        }
      });
    }
  });
};


/*
 * Delete a leave record
 * */
exports.delete = function (req, res) {
  Leave.remove({_id: req.params.id}, function (error, removedLeave) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 200, removedLeave);
    }
  });
};

