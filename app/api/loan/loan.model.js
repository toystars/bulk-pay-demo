'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var loanSchema = new Schema({
  businessId: {
    type: String,
    required: "Please specify companyId"
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  amount: Number,
  rate: Number,
  term: Number,
  payCount: {
    type: Number,
    default: 0
  },
  fullyServiced: {
    type: String,
    required: "Please specify type service status",
    default: "No"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Loan', loanSchema);