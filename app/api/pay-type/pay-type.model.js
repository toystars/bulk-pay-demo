'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var payTypesSchema = new Schema({
  code: {
    type: String,
    required: "Please, enter code",
    unique: true
  },
  title: {
    type: String,
    required: "Please, enter title"
  },
  businessId: {
    type: String,
    required: "Please specify companyId"
  },
  type: {
    type: String,
    required: "Please, enter type"
  },
  frequency: {
    type: String,
    required: "Please specify frequency",
    default: "Monthly"
  },
  taxable: {
    type: String,
    required: "Please specify taxable",
    default: "Yes"
  },
  editablePerEmployee: {
    type: String,
    required: "Please specify if type is editable per employee",
    default: "No"
  },
  derivative: {
    type: String,
    required: "Please specify type derivative",
    default: "Fixed"
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

module.exports = mongoose.model('PayType', payTypesSchema);