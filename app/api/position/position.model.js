'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var positionSchema = new Schema({
  code: String,
  name: String,
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

module.exports = mongoose.model('Position', positionSchema);
