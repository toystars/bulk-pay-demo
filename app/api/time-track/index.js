'use strict';

var express = require('express'),
  controller = require('./time-track.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.post('/', auth.isAuthenticated, controller.create);
  router.get('/employee/:employeeId', auth.isAuthenticated, controller.employeeTime);
  router.post('/employee/filtered', auth.isAuthenticated, controller.filteredEmployeeTimes);
  router.get('/business/:businessId', auth.isAuthenticated, auth.isSuperAdmin, controller.businessTime);
  router.get('/:id', auth.isAuthenticated, controller.show);
  router.put('/:id', auth.isAuthenticated, controller.update);
  router.put('/:id/send', auth.isAuthenticated, controller.send);
  router.delete('/:id', auth.isAuthenticated, controller.delete);

  app.use('/api/timetrack', router);

  return router;

};

