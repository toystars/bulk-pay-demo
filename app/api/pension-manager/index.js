'use strict';

var express = require('express'),
  controller = require('./pension-manager.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.post('/', auth.isAuthenticated, auth.isSuperAdmin, controller.create);
  router.get('/business/:id', auth.isAuthenticated, controller.pensionManagers);
  router.get('/:id', auth.isAuthenticated, controller.show);
  router.put('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.update);
  router.delete('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.destroy);

  app.use('/api/pensionmanagers', router);

  return router;

};
