'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  bcrypt = require("bcrypt-nodejs"),
  gravatar = require('gravatar'),
  validator = require('node-mongoose-validator');

var UserSchema = new Schema({

  name: String,
  username: String,
  email: {
    type: String,
    lowercase: true
  },
  avatar: String,
  businesses : [{
    type: Schema.Types.ObjectId,
    ref: 'Business'
  }],
  role: {
    type: String,
    default: 'superAdmin'
  },
  employeeId: String,
  businessId: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verifyEmailToken: String,
  verifyEmailTokenExpires: Date,
  verified: {
    type: Boolean,
    default: true
  }
});


/**
 * Virtuals
 */

// Public profile information
UserSchema.virtual('profile').get(function () {
  return {
    'name': this.name,
    'role': this.role
  };
});

// Non-sensitive info we'll be putting in the token
UserSchema.virtual('token').get(function () {
  return {
    '_id': this._id,
    'role': this.role
  };
});

/**
 * Validations
 */

// Validate empty email
UserSchema.path('email').validate(validator.isEmail(), 'Please provide a valid email address');

// Validate empty username
UserSchema.path('username').validate(function (username) {
  return username.length;
}, 'Username cannot be blank');

// Validate empty password
UserSchema.path('password').validate(function (password) {
  return password.length;
}, 'Password cannot be blank');

var validatePresenceOf = function (value) {
  return value && value.length;
};


/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  if (!this.avatar) {
    this.avatar = gravatar.url(this.email, {s: '200', r: 'x', d: 'retro'}, true);
  }

  if (!validatePresenceOf(this.password)) {
    next(new Error('Invalid password'));
  }

  this.hashPassword(this.password);
  return next();
});

/*
* Methods
* */
UserSchema.methods.authenticate = function (password, callback) {
  if (!callback) {
    return bcrypt.compareSync(password, this.password);
  } else {
    var responseValue = bcrypt.compareSync(password, this.password);
    callback(null, responseValue);
  }

};

UserSchema.methods.hashPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);