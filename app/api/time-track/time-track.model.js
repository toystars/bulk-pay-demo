'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var timeTrackSchema = new Schema({
  projectId: String,
  activityId: String,
  duration: Number,
  description: String,
  employeeId: String,
  employee : {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  businessId: String,
  date: Date,
  approvalStatus: {
    type: String,
    default: 'Pending'
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    default: 'Draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TimeTrack', timeTrackSchema);
