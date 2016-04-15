/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/jobs              ->  index
 * POST    /api/jobs              ->  create
 * GET     /api/jobs/:id          ->  show
 * PUT     /api/jobs/:id          ->  update
 * DELETE  /api/jobs/:id          ->  destroy
 */

'use strict';

require('./job.model.js');
var mongoose = require('mongoose'),
  Job = mongoose.model('Job'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all jobs
 */
exports.index = function (req, res) {
  Job.find({}, function (error, jobs) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (jobs) {
      crudHelper.respondWithResult(res, null, jobs);
    }
  });
};

/**
 * Get all jobs per business
 */
exports.jobs = function (req, res) {
  Job.find({ businessId: req.params.id }, function (error, jobs) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (jobs) {
      crudHelper.respondWithResult(res, null, jobs);
    }
  });
};

/*
 * Create new job
 * */
exports.create = function (req, res) {
  var newJob = new Job(req.body);
  newJob.save(function (error, job) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      Job.findOne({ _id: job._id }, function (error, job) {
        if (error) {
          crudHelper.handleError(res, null, error);
        } else {
          crudHelper.respondWithResult(res, 201, job);
        }
      });
    }
  });
};

/*
 * Fetch a job
 * */
exports.show = function (req, res) {
  Job.findOne({ _id: req.params.id }, function (error, job) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (job) {
      crudHelper.respondWithResult(res, null, job);
    } else {
      crudHelper.handleError(res, null, { message: 'Payment rule not found!' });
    }
  });
};

/*
 * Update single job
 * */
exports.update = function (req, res) {
  Job.findOne({ _id: req.params.id }, function (error, job) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, job, true);
    }
  });
};

