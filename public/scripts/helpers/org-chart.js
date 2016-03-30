
/*
* Org Chart helper class
* */

var BulkOrgChart = function (containerObject, source, initialDepth, exportFlag) {

  var container = containerObject;
  var dataSource = source;
  var depth = initialDepth;
  var exportable = exportFlag;

  var createChart = function () {
    container.orgchart({
      'data' : dataSource,
      'depth': depth,
      'exportButton': exportable,
      'nodeTitle': 'title',
      'nodeContent': 'name',
      'nodeID': 'id',
      'createNode': function($node, data) {
        $node.on('dblclick', function () {
          data.callBack(data.employee);
        });
      }
    });
  };

  return {
    createChart: createChart
  };
};