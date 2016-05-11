'use strict';

var express = require('express'),
  controller = require('./leave.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.post('/', auth.isAuthenticated, controller.create);
  router.get('/employee/:employeeId', auth.isAuthenticated, controller.employeeLeaves);
  router.get('/business/:businessId', auth.isAuthenticated, auth.isSuperAdmin, controller.businessLeaves);
  router.get('/:id', auth.isAuthenticated, controller.show);
  router.put('/:id', auth.isAuthenticated, controller.update);

  app.use('/api/leave', router);

  return router;

};

