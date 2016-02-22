'use strict';

var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport, User) {

  passport.use('local-signin', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function (username, password, done) {
      var criteria = (username.indexOf('@') === -1) ? {
        username: username
      } : {
        email: username
      };
      User.findOne(criteria, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Unknown user'
          });
        }
        if (user.verified) {
          if (!user.comparePassword(password)) {
            return done(null, false, {
              message: 'Invalid password'
            });
          }
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Please verify your email address first'
          });
        }
      });
    }
  ));

  passport.use('local', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, username, password, done) {
      User.findOne({
        email: req.body.email
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, {
            message: 'Email already taken.'
          });
        } else {
          User.findOne({
            username: username
          }, function (err, user) {
            if (err) {
              return done(err);
            }
            if (user) {
              return done(null, false, {
                message: 'Username already taken.'
              });
            }
            return done(null, req.body);
          });
        }
      });
    }
  ));
};