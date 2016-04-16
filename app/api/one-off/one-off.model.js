'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var oneOffSchema = new Schema({
  employee : {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  payment: {
    type: Schema.Types.Mixed,
    required: "Please specify payment details"
  },
  description: {
    type: String,
    required: "Please specify description"
  },
  id: {
    type: String,
    required: "Please specify description"
  },
  customTitle: {
    type: String
  },
  businessId: {
    type: String,
    required: "Please specify companyId"
  },
  serviced: {
    type: String,
    default: 'No'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OneOff', oneOffSchema);