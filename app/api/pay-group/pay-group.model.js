'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var payGroupsSchema = new Schema({
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
  tax: {
    type: Schema.Types.ObjectId,
    ref: 'Tax'
  },
  pension: {
    type: Schema.Types.ObjectId,
    ref: 'Pension'
  },
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

module.exports = mongoose.model('PayGroup', payGroupsSchema);