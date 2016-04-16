'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var jobSchema = new Schema({
  code: {
    type: String,
    required: "Please specify jobCode"
  },
  title: {
    type: String
  },

  role: {
    type: String
  },
  positionId: {
    type: String,
    required: "Please specify positionId"
  },
  position : {
    type: Schema.Types.ObjectId,
    ref: 'Position'
  },
  description: {
    type: String,
    required: "Please specify description"
  },
  businessId: {
    type: String,
    required: "Please specify companyId"
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

module.exports = mongoose.model('Job', jobSchema);