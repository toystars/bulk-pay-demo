'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var departmentSchema = new Schema({
  name: {
    type: String,
    required: "Please, enter title"
  },
  isGeneric: {
    type: String,
    default: 'No'
  },
  isParent: {
    type: String,
    default: 'Yes'
  },
  divisionsServed: [ { type: Schema.Types.Mixed } ],
  location: String,
  parentId: String,
  parentName: String,
  divisionId: String,
  divisionName: String,
  businessId: String,
  status: {
    type: String,
    default: "Active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Department', departmentSchema);


