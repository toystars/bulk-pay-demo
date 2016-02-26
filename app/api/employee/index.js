'use strict';

var express = require('express'),
  controller = require('./employee.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.post('/', auth.isAuthenticated, auth.isSuperAdmin, controller.create);
  router.get('/business/:id', auth.isAuthenticated, controller.employees);
  router.get('/:id', auth.isAuthenticated, controller.show);
  router.get('/paygroup/:payGroupId', auth.isAuthenticated, controller.getByPayGroup);
  router.put('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.updateEmployee);
  router.delete('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.destroy);

  app.use('/api/employees', router);

  return router;

};
