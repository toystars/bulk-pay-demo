'use strict';

var express = require('express'),
  controller = require('./employee.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.get('/last/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.getLast);
  router.post('/', auth.isAuthenticated, auth.isSuperAdmin, controller.create);
  router.post('/photo', auth.isAuthenticated, auth.isSuperAdmin, controller.savePhoto);
  router.get('/business/:id', auth.isAuthenticated, controller.employees);
  router.post('/business/:id/filtered', auth.isAuthenticated, controller.filteredEmployees);
  router.get('/position/:positionId', auth.isAuthenticated, controller.getPositionEmployees);
  router.get('/:id', auth.isAuthenticated, controller.show);
  router.get('/paygroup/:payGroupId', auth.isAuthenticated, controller.getByPayGroup);
  router.put('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.updateEmployee);
  router.delete('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.destroy);

  app.use('/api/employees', router);

  return router;

};
