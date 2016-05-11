'use strict';

var express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  config = require('./config'),
  passport = require('passport'),
  multer = require('multer'),
  mongoose = require('mongoose');

require('../app/api/user/user.model.js');
var User = mongoose.model('User');

module.exports = function() {
  var app = express();

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  //Parses form data
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret
  }));

  app.use(multer({
    dest: __dirname + './../public/uploads/',
    limits: {
      ileSize: 5000000,
      files: 1
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static('./public/'));

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, Accept, Content-Type, Access-Control-Allow-Headers, x_access_admin, Authorization, X-Requested-With");
    res.header('Access-Control-Allow-Methods', "POST, PUT, DELETE, GET");
    next();
  });

  app.set('view engine', 'ejs');

  app.set('views', '../app/views');

  require('./passport')(passport);
  require("../app/routes/index.js")(app, passport);
  

  return app;
};
