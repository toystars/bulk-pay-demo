/*
'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var jobLevelSchema = new Schema({
  code: {
    type: String,
    required: "Please, enter code"
  },
  title: {
    type: String,
    required: "Please, enter title"
  },
  companyId: {
    type: String,
    required: "Please specify companyId"
  },
  status: {
    type: String,
    required: "Please specify type status",
    default: "Active"
  },
  departmentId: {
    type: String,
    required: "Please specify departmentId"
  }
});

module.exports = mongoose.model('JobLevel', jobLevelSchema);
*/
