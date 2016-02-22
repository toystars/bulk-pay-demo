/*
'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var scaleTypeSchema = new Schema({
  cellId: {
    type: String,
    required: "Please specify cellId"
  },
  title: {
    type: String,
    required: "Please specify title"
  },
  code: {
    type: String,
    required: "Please specify code",
    unique: true
  },
  id: {
    type: String,
    required: "Please specify id",
    unique: true
  },
  derivative: {
    type: String
  },
  derived: {
    type: String,
    required: "Please specify derived"
  },
  type: {
    type: String,
    required: "Please specify type"
  },
  value: {
    type: Number
  },
  editablePerEmployee: {
    type: String,
    required: "Please specify if type is editable per employee"
  },
  payDate: {
    type: Date
  }
});

var scaleSchema = new Schema({
  code: {
    type: String,
    required: "Please, enter code",
    unique: true
  },
  description: {
    type: String
  },
  title: {
    type: String,
    required: "Please, enter title"
  },
  companyId: {
    type: String,
    required: "Please specify companyId"
  },
  jobLevelId: {
    type: String,
    required: "Please specify jobLevelId"
  },
  status: {
    type: String,
    required: "Please specify type status",
    default: "Active"
  },
  payTypes: [scaleTypeSchema]
});

module.exports = mongoose.model('Scales', scaleSchema);*/
