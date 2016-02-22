'use strict';

var express = require('express'),
  auth = require('../../auth/auth.service.js'),
  controller = require('./code.controller.js'),
  router = express.Router();

module.exports = function (app) {

  // middleware to be attached later

  router.get('/', controller.index);
  router.post('/', controller.create);
  router.get('/:id', controller.show);
  router.put('/:id', controller.update);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.destroy);

  app.use('/api/codes', router);

  return router;

};

