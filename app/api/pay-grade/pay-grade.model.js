'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var payGradesSchema = new Schema({
  code: {
    type: String,
    required: "Please, enter code"
  },
  name: {
    type: String,
    required: "Please, enter title"
  },
  description: {
    type: String
  },
  businessId: {
    type: String,
    required: "Please specify businessId"
  },
  payGroupId: {
    type: String,
    required: "Please specify payGroupId"
  },
  status: {
    type: String,
    required: "Please specify type status",
    default: "Active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  payTypes: [{
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
      required: "Please specify code"
    },
    payTypeId: {
      type: String,
      required: "Please specify id"
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
  }]
});

module.exports = mongoose.model('payGrade', payGradesSchema);
