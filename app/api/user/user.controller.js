'use strict';

require('./user.model.js');
require('../auth-code/code.model.js');
var mongoose = require('mongoose'),
  config = require('../../../config/config'),
  bcrypt = require('bcrypt-nodejs'),
  User = mongoose.model('User'),
  jwt = require('jsonwebtoken'),
  Code = mongoose.model('Code'),
  crudHelper = require('../../helpers/crud.js');


exports.signUp = function(strategy, passport) {
  return function(req, res, next) {
    passport.authenticate(strategy, function(err, user, message) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(400).json(message);
      } else {
        if (!req.body.authorizationCode) {
          res.status(400).json({message: 'Validation code required!'});
        } else {
          Code.findOne({ code: req.body.authorizationCode, active: true }, function (error, code) {
            if (!code) {
              crudHelper.handleError(res, null, { message: 'Authorization code invalid or used!' });
            } else {
              var newUser = new User(req.body);
              var regex = new RegExp('/', 'g');
              newUser.authorizationCodeId = code._id;
              newUser.authorizationCode = code.code;
              newUser.verifyEmailToken = bcrypt.genSaltSync(8).toString('hex').replace(regex, '');
              newUser.verifyEmailTokenExpires = Date.now() + 3600000;
              newUser.save(function (err, user) {
                if (err) {
                  return next(err);
                }
                var token = jwt.sign(user, config.sessionSecret, {
                  expiresIn: 60 * 60 * 5
                });
                crudHelper.handleAuthCodeUsed(res, { token: token }, code);
              });
            }
          });
        }
      }
    })(req, res, next);
  };
};

exports.signIn = function(strategy, passport) {
  return function(req, res, next) {
    passport.authenticate(strategy, function(err, user, message) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(400).send(message);
      } else {
        var token = jwt.sign(user, config.sessionSecret, {
          expiresIn: 60 * 60 * 5
        });
        crudHelper.respondWithResult(res, null, { token: token });
      }
    })(req, res, next);
  };
};


/**
* Get my info
*/
exports.me = function (req, res) {
  var userId = req.user._id;
  User.findOne({ _id: userId }, '-password').populate('businesses').exec(function (error, user) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (user) {
      crudHelper.respondWithResult(res, null, user);
    }
  });
};