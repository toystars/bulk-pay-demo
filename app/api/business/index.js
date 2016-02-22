'use strict';

var express = require('express'),
  controller = require('./business.controller.js'),
  auth = require('../../auth/auth.service'),
  router = express.Router();

module.exports = function (app) {

  router.get('/', auth.isAuthenticated, controller.index);
  router.post('/', auth.isAuthenticated, auth.isSuperAdmin, controller.create);
  router.get('/:id', controller.show);
  router.put('/:id', auth.isAuthenticated, auth.isSuperAdmin, controller.updateBusiness);
  /*router.delete('/:id', /!*auth.hasRole('admin'),*!/ controller.destroy);

   */

  app.use('/api/businesses', router);

  return router;

};

