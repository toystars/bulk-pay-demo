'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var employeesSchema = new Schema({
  address: String,
  businessId: String,
  businessUnitId: String,
  payGrade: {
    type: Schema.Types.Mixed,
    default: {}
  },
  taxRule: {
    type: Schema.Types.Mixed,
    default: {}
  },
  pensionRule: {
    type: Schema.Types.Mixed,
    default: {}
  },
  loans: {
    type: Schema.Types.Mixed,
    default: []
  },
  expenses: {
    type: Schema.Types.Mixed,
    default: []
  },
  city: String,
  confirmationDate: Date,
  customPayTypes: [ { type: Schema.Types.Mixed } ],
  dateOfBirth: Date,
  departmentId: String,
  divisionId: String,
  profilePictures: [ { type: Schema.Types.Mixed } ],
  currentProfilePicture: String,
  editablePayTypes: [{ type: Schema.Types.Mixed }],
  email: String,
  employeeId: String,
  employmentDate: Date,
  exemptedPayTypes: [{ type: Schema.Types.Mixed }],
  firstName: String,
  gender: String,
  leaveDaysTaken: {
    type: Number,
    default: 0
  },
  guarantor: { type: Schema.Types.Mixed },
  lastName: String,
  maritalStatus: String,
  otherNames: String,
  payGradeId: String,
  payGroupId: String,
  selfService: {
    type: String,
    default: 'Active'
  },
  paymentDetails: { type: Schema.Types.Mixed },
  phone: String,
  positionId: String,
  state: String,
  location: String,
  status: {
    type: String,
    default: 'Active'
  },
  terminationDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

employeesSchema.virtual('fullName').get(function () {
    return  this.lastName + ' ' + this.firstName + ' ' + this.otherNames;
});

module.exports = mongoose.model('Employee', employeesSchema);
