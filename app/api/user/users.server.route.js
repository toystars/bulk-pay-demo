'use strict';

var express = require("express"),
  auth = require("auth.server.controller.js"),
  router = express.Router();

module.exports = function (app, passport) {

  router.route('/api/signup')
    .post(auth.signUp('local', passport));

  router.route('/api/signin')
    .post(auth.signIn('local-signin', passport));

  app.use('/', router);

  return router;

};
