'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var paymentRuleSchema = new Schema({
  code: {
    type: String,
    required: "Please, enter code"
  },
  name: {
    type: String,
    required: "Please, enter title"
  },
  businessId: {
    type: String,
    required: "Please specify companyId"
  },
  rules: { type: Schema.Types.Mixed },
  repaymentTypes: [{ type: Schema.Types.Mixed }],
  repaymentType: String,
  status: {
    type: String,
    required: "Please specify type status",
    default: "Active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PaymentRule', paymentRuleSchema);