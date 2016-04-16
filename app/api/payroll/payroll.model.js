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
  position: {
    type: Schema.Types.ObjectId,
    ref: 'Position'
  },
  pensionManager: {
    type: Schema.Types.ObjectId,
    ref: 'PensionManager'
  },
  YTD: {
    type: Schema.Types.Mixed,
    default: {
      gross: 0,
      net: 0,
      tax: 0
    }
  },
  grossPay: Number,
  tax: Number,
  pension: Number,
  totalDeduction: Number,
  netPay: Number,
  repayments: [ { type: Schema.Types.Mixed } ],
  payTypes: [ { type: Schema.Types.Mixed } ],
  paymentDetails: { type: Schema.Types.Mixed },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PayRoll', payRollSchema);
