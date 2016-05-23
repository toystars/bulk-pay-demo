'use strict';

var express = require('express'),
  controller = require('./expense.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.post('/', auth.isAuthenticated, controller.create);
  router.get('/employee/:employeeId', auth.isAuthenticated, controller.employeeExpenses);
  router.get('/business/:businessId', auth.isAuthenticated, auth.isSuperAdmin, controller.businessExpenses);
  router.get('/:id', auth.isAuthenticated, controller.show);
  router.put('/:id', auth.isAuthenticated, controller.update);
  router.post('/employee/filtered', auth.isAuthenticated, controller.filteredEmployeeExpenses);
  router.post('/admin/filtered', auth.isAuthenticated, controller.filteredBusinessExpenses);
  router.put('/:id/service', auth.isAuthenticated, auth.isSuperAdmin, controller.serviceExpense);
  router.post('/:id/approve', auth.isAuthenticated, auth.isSuperAdmin, controller.approveExpense);
  router.put('/:id/send', auth.isAuthenticated, controller.send);
  router.delete('/:id', auth.isAuthenticated, controller.delete);

  app.use('/api/expense', router);

  return router;

};

