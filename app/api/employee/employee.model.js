'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var employeesSchema = new Schema({
  address: String,
  businessId: String,
  businessUnitId: String,
  city: String,
  confirmationDate: Date,
  customPayTypes: [{type: Schema.Types.Mixed }],
  dateOfBirth: Date,
  departmentId: String,
  divisionId: String,
  editablePayTypes: [{
    cellId: String,
    code: String,
    derivative: String,
    derived: String,
    editablePerEmployee: String,
    frequency: String,
    isBase: Boolean,
    payTypeId: String,
    taxable: String,
    title: String,
    type: String,
    value: Number
  }],
  email: String,
  employeeId: String,
  employmentDate: Date,
  exemptedPayTypes: [{
    code: String,
    title: String
  }],
  firstName: String,
  gender: String,
  guarantor: {
    address: String,
    city: String,
    email: String,
    fullName: String,
    phone: String,
    state: String
  },
  lastName: String,
  maritalStatus: String,
  otherNames: String,
  payGradeId: String,
  payGroupId: String,
  paymentDetails: {
    accountName: String,
    accountNumber: String,
    bank: String,
    paymentMethod: String
  },
  phone: String,
  positionId: String,
  state: String,
  terminationDate: String
});

module.exports = mongoose.model('employee', employeesSchema);
