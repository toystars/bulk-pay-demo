'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var activitySchema = Schema({
  oldValue: String,
  newValue: String,
  referenceId: String,
  referenceKey: String,
  event: String
});

var historySchema = Schema({
  objectId: String,
  date: {
    type: Date,
    default: Date.now
  },
  activities: {
    type: [activitySchema]
  },
  userId: String,
  user : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});


module.exports = mongoose.model('Activity', activitySchema);
module.exports = mongoose.model('History', historySchema);
