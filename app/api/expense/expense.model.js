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
  approved: {
    type: Boolean,
    default: false
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
