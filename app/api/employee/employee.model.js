'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var employeesSchema = new Schema({

});

module.exports = mongoose.model('employee', employeesSchema);
