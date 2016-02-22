'use strict';

var express = require('express'),
  controller = require('./division.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.post('/', auth.isAuthenticated, auth.isSuperAdmin, controller.create);
  router.get('/business/:id', auth.isAuthenticated, controller.divisions);
  router.get('/:id', auth.isAuthenticated, controller.show);
  router.put('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.updateDivision);
  router.delete('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.destroy);


  app.use('/api/divisions', router);

  return router;

};

