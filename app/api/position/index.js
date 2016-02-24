'use strict';

var express = require('express'),
  controller = require('./position.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.post('/', auth.isAuthenticated, auth.isSuperAdmin, controller.create);
  router.get('/employees/:positionId', auth.isAuthenticated, auth.isSuperAdmin, controller.getPositionEmployees);
  router.get('/business/:id', auth.isAuthenticated, controller.positions);
  router.get('/:id', auth.isAuthenticated, controller.show);
  router.put('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.updatePosition);
  router.delete('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.destroy);

  app.use('/api/positions', router);

  return router;

};

