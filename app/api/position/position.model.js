'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var positionSchema = new Schema({
  code: String,
  name: String,
  businessId: String,
  businessUnitId: String,
  divisionId: String,
  departmentId: String,
  parentPositionId: String,
  headingSection: String,
  headingSectionId: String,
  leave: [{ type: Schema.Types.Mixed }],
  numberOfAllowedEmployees: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Position', positionSchema);
