'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var db = require("./config/mongoose")(),
  app = require("./config/express")(),
  nodeElasticSearch = require('node-elasticsearch-sync'),
  port = process.env.PORT || 9000;

process.env['MONGO_OPLOG_URL'] = 'mongodb://localhost:27017/bulkpay-demo';
process.env['MONGO_DATA_URL'] = 'mongodb://localhost:27017/bulkpay-demo';
process.env['ELASTIC_SEARCH_URL'] = 'http://localhost:9200';
process.env['BATCH_COUNT'] = 20;


let sampleWatcher = {
  collectionName: 'users',
  index: 'person',
  type: 'users',
  transformFunction: null,
  fetchExistingDocuments: true,
  priority: 0
};
var watchers = [];
watchers.push(sampleWatcher);

nodeElasticSearch.init(watchers, null);


app.listen(port, function (error) {
  if (error) {
    console.log(error);
  }
  console.log('Available on port ' + port);
});

module.exports = app;


