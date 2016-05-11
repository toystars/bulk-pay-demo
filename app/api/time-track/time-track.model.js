'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var timeTrackSchema = new Schema({
  displayDuration: String,
  labeledDuration: String,
  taskCode: String,
  description: String,
  employee : {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  businessId: String,
  employeeId: String,
  time: Number,
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
