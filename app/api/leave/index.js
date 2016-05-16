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
  router.get('/employee/:employeeId/position', auth.isAuthenticated, controller.getEmployeePosition);
  router.get('/:id', auth.isAuthenticated, controller.show);
  router.put('/:id', auth.isAuthenticated, controller.update);
  router.put('/:id/send', auth.isAuthenticated, controller.send);
  router.delete('/:id', auth.isAuthenticated, controller.delete);
  router.post('/employee/filtered', auth.isAuthenticated, controller.filteredEmployeeLeaves);

  app.use('/api/leave', router);

  return router;

};

