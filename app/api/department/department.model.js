'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var departmentSchema = new Schema({
  name: {
    type: String,
    required: "Please, enter title"
  },
  isParent: {
    type: String,
    default: 'Yes'
  },
  location: String,
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Department'
  },
  division: {
    type: Schema.Types.ObjectId,
    ref: 'Division'
  },
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


