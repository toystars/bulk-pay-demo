'use strict';

var express = require('express'),
  controller = require('./history.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.get('/object/:id', controller.getByObject);
  router.get('/:id', controller.show);

  app.use('/api/histories', router);

  return router;

};

