'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var pensionManagerSchema = new Schema({
  businessId: String,
  code: String,
  name: String,
  status: {
    type: String,
    default: "Active"
  },
  accountDetails: Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PensionManager', pensionManagerSchema);
