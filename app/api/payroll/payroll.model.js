'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var payRollSchema = new Schema({
  businessId: String,
  payRunId: String,
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  grossPay: Number,
  tax: Number,
  pension: Number,
  totalDeduction: Number,
  netPay: Number,
  payTypes: [ { type: Schema.Types.Mixed } ],
  paymentDetails: { type: Schema.Types.Mixed },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PayRoll', payRollSchema);
