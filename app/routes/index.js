'use strict';

/*
var typeRoute = require('./../api/type/types.server.route.js');
var companyRoute = require('./../api/legal-entity/company.server.route.js');
var payScaleRoute = require('./../api/pay-grade/scales.server.route.js');
var structureRoute = require('./structures.server.route');*/

var authRoute = require('../api/user/index');
var codeRoute = require('../api/auth-code/index');
var businessRoute = require('../api/business/index');
var businessUnitRoute = require('../api/business-unit/index');
var historyRoute = require('../api/history/index');
var divisionRoute = require('../api/division/index');
var departmentRoute = require('../api/department/index');
var positionRoute = require('../api/position/index');
var payTypeRoute = require('../api/pay-type/index');
var payGroupRoute = require('../api/pay-group/index');
var payGradeRoute = require('../api/pay-grade/index');

module.exports = function(app, passport) {
  authRoute(app, passport);
  codeRoute(app);
  businessRoute(app);
  businessUnitRoute(app);
  historyRoute(app);
  divisionRoute(app);
  departmentRoute(app);
  positionRoute(app);
  payTypeRoute(app);
  payGroupRoute(app);
  payGradeRoute(app);
  /*userRoute(app, passport);
  typeRoute(app);
  companyRoute(app);
  payScaleRoute(app);
  structureRoute(app);*/
};