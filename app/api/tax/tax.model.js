'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var taxSchema = new Schema({
  businessId: String,
  code: String,
  name: String,
  grossIncomeRelief: {
    type: Number,
    default: 20
  },
  consolidatedRelief: {
    type: Number,
    default: 200000
  },
  payTypes: [ { type: Schema.Types.Mixed } ],
  status: {
    type: String,
    default: "Active"
  },
  rules: [ { type: Schema.Types.Mixed } ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tax', taxSchema);
