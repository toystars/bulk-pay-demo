'use strict';

var LocalStrategy = require('passport-local').Strategy;
var User = require("../app/api/user/user.model.js");

module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  require('./strategies/local')(passport, User);

};
