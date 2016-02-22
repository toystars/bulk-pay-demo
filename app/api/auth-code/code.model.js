'use strict';

var mongoose = require("mongoose");

var CodeSchema = new mongoose.Schema({
  code: String,
  active: {
    type: Boolean,
    default: true
  },
  usedDate: Date,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Validate empty email
CodeSchema.path('code').validate(function (code) {
  return code.length > 4;
}, 'Code must a minimum of 5 characters');

module.exports = mongoose.model('Code', CodeSchema);
