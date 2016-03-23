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
  activeAmount: Number,
  payments: [{type: Schema.Types.Mixed}],
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
  purpose: {
    type: String,
    default: 'Loan'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

loanSchema.pre('save', function (next) {
  var self = this;
  if (!self.activeAmount) {
    self.activeAmount = self.amount;
  }
  next();
});

module.exports = mongoose.model('Loan', loanSchema);