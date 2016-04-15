'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var jobSchema = new Schema({
  code: {
    type: String,
    required: "Please specify jobCode"
  },
  title: {
    type: String,
    required: "Please specify jobTitle"
  },
  positionId: {
    type: String,
    required: "Please specify positionId"
  },
  description: {
    type: String,
    required: "Please specify description"
  },
  businessId: {
    type: String,
    required: "Please specify companyId"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);