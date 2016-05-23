'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var expenseSchema = new Schema({
  from: Date,
  to: Date,
  type: String,
  description: String,
  businessId: String,
  employeeId: String,
  amount: Number,
  approvalStatus: {
    type: String,
    default: 'Pending'
  },
  attachments: [{ type: Schema.Types.Mixed }],
  serviced: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Expense', expenseSchema);
