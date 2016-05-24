/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/timetrack              ->  index
 * POST    /api/timetrack              ->  create
 * GET     /api/timetrack/:id          ->  show
 * PUT     /api/timetrack/:id          ->  update
 * DELETE  /api/timetrack/:id          ->  destroy
 */

'use strict';

require('./time-track.model.js');
require('../employee/employee.model.js');
var mongoose = require('mongoose'),
  Employee = mongoose.model('Employee'),
  TimeTrack = mongoose.model('TimeTrack'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all times
 */
exports.index = function (req, res) {
  TimeTrack.find({}, function (error, times) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (times) {
      crudHelper.respondWithResult(res, null, times);
    }
  });
};


/**
 * Get all positions per business
 */
exports.businessTime = function (req, res) {
  TimeTrack.find({ businessId: req.params.businessId }).populate('employee approvedBy').exec(function (error, times) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (times) {
      crudHelper.respondWithResult(res, null, times);
    }
  });
};


/*
* Get all employee times
* */
exports.employeeTime = function (req, res) {
  TimeTrack.find({ employeeId: req.params.employeeId }).populate('employee approvedBy').exec(function (error, times) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 200, times);
    }
  });
};


/*
 * Get filtered employees
 * */
exports.filteredEmployeeTimes = function (req, res) {
  TimeTrack.find(req.body).populate('employee approvedBy').exec(function (error, times) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (times) {
      crudHelper.respondWithResult(res, null, times);
    }
  });
};


/*
 * Create new time
 * */
exports.create = function (req, res) {
  var newTime = new TimeTrack(req.body);
  newTime.save(function (error, time) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      TimeTrack.findOne({ _id: time._id }).populate('employee').exec(function (error, populatedTime) {
        if (error) {
          crudHelper.handleError(res, 400, error);
        } else {
          crudHelper.respondWithResult(res, 201, populatedTime);
        }
      });
    }
  });
};


/*
 * Fetch a position
 * */
exports.show = function (req, res) {
  TimeTrack.findOne({ _id: req.params.id }, function (error, time) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (time) {
      crudHelper.respondWithResult(res, null, time);
    } else {
      crudHelper.handleError(res, null, { message: 'Time Record not found!' });
    }
  });
};


/*
 * Update single position
 * */
exports.update = function (req, res) {
  TimeTrack.findOne({ _id: req.params.id }, function (error, time) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, time, true);
    }
  });
};


/*
* Mark time record as sent
* */
exports.send = function (req, res) {
  TimeTrack.findOne({ _id: req.params.id }, function (error, time) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      time.status = 'Sent';
      time.save(function (error, newTime) {
        if (error) {
          crudHelper.handleError(res, null, error);
        } else {
          crudHelper.respondWithResult(res, 200, newTime);
        }
      });
    }
  });
};


/*
* Delete a time record
* */
exports.delete = function (req, res) {
  TimeTrack.remove({_id: req.params.id}, function (error, removedTime) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 200, removedTime);
    }
  });
};


/*
 * Mark time record as approved or declined
 * */
exports.approveTime = function (req, res) {
  TimeTrack.findOne({ _id: req.params.id }, function (error, time) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      time.approvalStatus = req.body.approvalStatus;
      time.approvedBy = req.body.approvedBy;
      time.save(function (error, newTimr) {
        if (error) {
          crudHelper.handleError(res, null, error);
        } else {
          crudHelper.respondWithResult(res, 200, newTimr);
        }
      });
    }
  });
};


/*
 * Get filtered business time records
 * */
exports.filteredBusinessTime = function (req, res) {
  TimeTrack.find(req.body).populate('employee approvedBy').exec(function (error, times) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (times) {
      crudHelper.respondWithResult(res, null, times);
    }
  });
};










