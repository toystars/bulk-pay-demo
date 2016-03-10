'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var employeesSchema = new Schema({
  address: String,
  businessId: String,
  businessUnitId: String,
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
  guarantor: { type: Schema.Types.Mixed },
  lastName: String,
  maritalStatus: String,
  otherNames: String,
  payGradeId: String,
  payGroupId: String,
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
    return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.model('Employee', employeesSchema);
