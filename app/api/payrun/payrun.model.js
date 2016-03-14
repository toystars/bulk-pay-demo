'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var payRunSchema = new Schema({
  businessId: String,
  numberOfEmployees: Number,
  payGroup: String,
  paymentDate: {
    type: Date,
    default: Date.now
  },
  totalAmountPaid: Number,
  taxPaid: Number,
  pensionPaid: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PayRun', payRunSchema);
