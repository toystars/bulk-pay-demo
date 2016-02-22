/*
'use strict';

var express = require("express"),
  scales = require("scales.server.controller.js"),
  router = express.Router();

module.exports = function (app) {

  router.route('/api/pay/scales')
    .get(scales.getAllPayScales)
    .post(scales.createPayScale);

  router.route('/api/pay/scales/:id')
    .put(scales.updatePayScale)
    .delete(scales.deletePayScale);

  router.route('/api/company/scales/:companyId')
    .get(scales.getCompanyPayScales);

  app.use('/', router);

  return router;

};
*/
