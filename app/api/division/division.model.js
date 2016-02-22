'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var divisionSchema = Schema({
  name: String,
  businessUnitId: String,
  isParent: {
    type: Boolean,
    default: false
  },
  businessUnitName: String,
  parentId: String,
  parentName: String,
  location: String,
  businessId: String,
  status: {
    type: String,
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Division', divisionSchema);
