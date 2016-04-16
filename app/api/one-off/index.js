'use strict';

var express = require('express'),
  controller = require('./one-off.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.post('/', auth.isAuthenticated, auth.isSuperAdmin, controller.create);
  router.get('/business/:id', auth.isAuthenticated, controller.oneoffs);
  router.get('/:id', auth.isAuthenticated, controller.show);
  router.put('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.update);
  router.put('/:id/service', auth.isAuthenticated, auth.isSuperAdmin, controller.service);

  app.use('/api/oneoffs', router);

  return router;

};


