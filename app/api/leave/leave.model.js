'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var leaveSchema = new Schema({
  startDate: Date,
  endDate: Date,
  duration: Number,
  type: String,
  description: String,
  businessId: String,
  employeeId: String,
  approvalStatus: {
    type: String,
    default: 'Pending'
  },
  employee : {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
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

module.exports = mongoose.model('Leave', leaveSchema);
