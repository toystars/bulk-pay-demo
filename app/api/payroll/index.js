'use strict';

var express = require('express'),
  controller = require('./payroll.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.post('/', auth.isAuthenticated, auth.isSuperAdmin, controller.create);
  router.get('/payrun/:payRunId', auth.isAuthenticated, controller.payrolls);
  router.get('/:id', auth.isAuthenticated, controller.show);

  app.use('/api/payrolls', router);

  return router;

};
