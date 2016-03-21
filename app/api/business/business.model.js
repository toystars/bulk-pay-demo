'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var businessSchema = Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  country: String,
  website: String,
  status: {
    type: String,
    default: 'Active'
  },
  currency: {
    type: Schema.Types.Mixed,
    default: {
      currency: "NGN",
      format: "%v %s",
      symbol: "₦"
    }
  },
  industry: String,
  contactName: String,
  contactEmail: String,
  contactPhone: String,
  creatorId: String,
  creator : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Business', businessSchema);
