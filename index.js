'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var db = require("./config/mongoose")(),
  app = require("./config/express")(),
  port = process.env.PORT || 9000;

app.listen(port, function (error) {
  if (error) {
    console.log(error);
  }
  console.log('Available on port ' + port);
});

module.exports = app;


