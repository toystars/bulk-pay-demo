'use strict';
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/codes              ->  index
 * POST    /api/codes              ->  create
 * GET     /api/codes/:id          ->  show
 * PUT     /api/codes/:id          ->  update
 * DELETE  /api/codes/:id          ->  destroy
 */

/*import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import Code from '../code/code.model';*/

var mongoose = require('mongoose');
require('../auth-code/code.model.js');
require('./user.model.js');
var Code = mongoose.model('Code');
var crudHelper = require('../../helpers/crud.js');

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function handleAuthCodeUsed(res, token, code) {
  code.active = false;
  code.usedDate = new Date();
  code.saveAsync().spread(code => {
    if (code) {
      res.json({ token });
    }
  });
}

// Gets a list of Codes
exports.index = function (req, res) {
  Code.find(function (error, codes) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else {
      crudHelper.respondWithResult(res, null, codes);
    }
  });
};

// Creates a new Code in the DB
exports.create = function (req, res) {
  var newCode = new Code(req.body);
  newCode.save(function (error, code) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, code);
    }
  });
};


/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  User.findAsync({}, '-salt -password')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
/*export function create(req, res, next) {
  if (!req.body.authorizationCode) {
    res.json({message: 'Validation code required!'});
  }
  Code.findOneAsync({ code: req.body.authorizationCode, active: true })
    .then(code => {
      if (!code) {
        return res.status(401).json({ message: 'Authorization code invalid or used!' });
      }
      var newUser = new User(req.body);
      newUser.role = 'admin';
      newUser.authorizationCodeId = code._id;
      newUser.saveAsync()
        .spread(function(user) {
          var token = jwt.sign({ _id: user._id }, config.secrets.session, {
            expiresIn: 60 * 60 * 5
          });
          handleAuthCodeUsed(res, token, code);
        })
        .catch(validationError(res));
    })
    .catch(err => next(err));
}

/!**
 * Get a single user
 *!/
export function show(req, res, next) {
  var userId = req.params.id;

  User.findByIdAsync(userId)
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/!**
 * Deletes a user
 * restriction: 'admin'
 *!/
export function destroy(req, res) {
  User.findByIdAndRemoveAsync(req.params.id)
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/!**
 * Change a users password
 *!/
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findByIdAsync(userId)
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.saveAsync()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/!**
 * Get my info
 *!/
export function me(req, res, next) {
  var userId = req.user._id;

  User.findOneAsync({ _id: userId }, '-salt -password')
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/!**
 * Authentication callback
 *!/
export function authCallback(req, res, next) {
  res.redirect('/');
}*/
