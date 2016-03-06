'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var pensionSchema = new Schema({
  businessId: String,
  code: String,
  name: String,
  status: {
    type: String,
    default: "Active"
  },
  payTypes: [ { type: Schema.Types.Mixed } ],
  employerContributionRate: Number,
  employeeContributionRate: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pension', pensionSchema);
