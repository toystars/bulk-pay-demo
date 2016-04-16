'use strict';

var express = require('express'),
  controller = require('./pay-grade.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.post('/', auth.isAuthenticated, auth.isSuperAdmin, controller.create);
  router.get('/business/:id', auth.isAuthenticated, controller.payGrades);
  router.get('/:id', auth.isAuthenticated, controller.show);
  router.get('/position/:positionId', auth.isAuthenticated, controller.getByPosition);
  router.put('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.updatePayGrade);
  router.delete('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.destroy);

  app.use('/api/paygrades', router);

  return router;

};
