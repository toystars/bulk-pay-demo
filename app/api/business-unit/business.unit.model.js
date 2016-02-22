'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var businessSchema = Schema({
  name: String,
  parentId: String,
  parentName: String,
  location: String,
  businessId: String,
  status: {
    type: String,
    default: 'Active'
  },
  /*address: String,
  city: String,
  state: String,
  country: String,
  website: String,
  status: {
    type: String,
    default: 'Active'
  },
  industry: String,
  contactName: String,
  contactEmail: String,
  contactPhone: String,
  creatorId: String,
  creator : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },*/
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BusinessUnit', businessSchema);
