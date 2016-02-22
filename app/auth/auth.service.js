'use strict';

require('../api/user/user.model.js');
var mongoose = require('mongoose'),
  config = require('../../config/config'),
  User = mongoose.model('User'),
  jwt = require('jsonwebtoken');



/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
exports.isAuthenticated = function (req, res, next) {
  var token = req.headers.token;
  try {
    var decoded = jwt.verify(token, config.sessionSecret);
    req.user = decoded._doc;
    User.findOne({ _id: req.user._id }, '-password', function (error, user) {
      if (!user) {
        return res.json({ message: 'Authentication failed'});
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: 'Session Expired!'});
  }
};

/**
 * Checks if the user role meets the minimum requirements of the route
 */
exports.isSuperAdmin = function (req, res, next) {
  if (req.user.role !== 'superAdmin') {
    return res.status(401).json({ message: 'Unauthorized!'});
  }
  next();
};


/*

/!**
 * Returns a jwt token signed by the app secret
 *!/
export function signToken(id, role) {
  return jwt.sign({ _id: id, role: role }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

/!**
 * Set token cookie directly for oAuth strategies
 *!/
export function setTokenCookie(req, res) {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', token);
  res.redirect('/');
}*/
