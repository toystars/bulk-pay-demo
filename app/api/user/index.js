'use strict';

var express = require('express'),
  controller = require('./user.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app, passport) {

  // middleware to be attached later

  /*router.get('/', /!*auth.hasRole('admin'),*!/ controller.index);*/
  router.post('/signup', controller.signUp('local', passport));
  router.get('/me', auth.isAuthenticated, controller.me);
  router.post('/signin', controller.signIn('local-signin', passport));
  /*router.delete('/:id', /!*auth.hasRole('admin'),*!/ controller.destroy);
  router.put('/:id/password', /!*auth.isAuthenticated(),*!/ controller.changePassword);
  router.get('/:id', /!*auth.isAuthenticated(),*!/ controller.show);*/

  app.use('/api/users', router);

  return router;

};
