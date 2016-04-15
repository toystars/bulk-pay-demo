/*
* Crud helper functions
* */

require('../api/history/history.model.js');
var _ = require('underscore'),
  mongoose = require('mongoose'),
  History = mongoose.model('History'),
  audit = require('./audit.js');

var respondWithResult = function (res, statusCode, entity) {
  statusCode = statusCode || 200;
  if (entity) {
    res.status(statusCode).json(entity);
  }
};
exports.respondWithResult = respondWithResult;

var handleEntityNotFound = function (req, res, entity, flag) {
  if (!entity) {
    handleError(res, null, {message: 'Not found'});
  } else {
    if (flag) {
      saveUpdates(req, res, entity);
    } else {
      removeEntity(res, entity);
    }
  }
};
exports.handleEntityNotFound = handleEntityNotFound;

var handleDepartmentUpdate = function (req, res, entity, model) {
  if (!entity) {
    handleError(res, null, {message: 'Not found'});
  } else {
    var changes = audit.diff(entity._doc, req.body);
    if (changes.length) {
      var updated = _.extend(entity, req.body);
      if (updated.isParent === 'Yes') {
        updated.parent = null;
      } else {
        updated.division = null;
      }
      updated.save(function (error, update) {
        if (error) {
          handleError(res, null, error);
        } else {
          var doc = {
            objectId: update._id,
            userId: req.user._id,
            activities: changes,
            user: req.user._id
          };
          var newHistory = new History(doc);
          newHistory.save(function (error, history) {
            model.findOne({ _id: update.id }).populate('parent division').exec(function (error, department) {
              if (error) {
                handleError(res, null, error);
              } else {
                respondWithResult(res, null, department);
              }
            });
          });
        }
      });
    } else {
      respondWithResult(res, null, req.body);
    }
  }
};
exports.handleDepartmentUpdate = handleDepartmentUpdate;

var saveUpdates = function (req, res, entity) {
  var changes = audit.diff(entity._doc, req.body);
  if (changes.length) {
    var updated = _.extend(entity, req.body);
    updated.save(function (error, update) {
      if (error) {
        handleError(res, null, error);
      } else {
        var doc = {
          objectId: update._id,
          userId: req.user._id,
          activities: changes,
          user: req.user._id
        };
        var newHistory = new History(doc);
        newHistory.save(function (error, history) {
          respondWithResult(res, null, update);
        });
      }
    });
  } else {
    respondWithResult(res, null, req.body);
  }
};
exports.saveUpdates = saveUpdates;

var removeEntity = function (res, entity) {
  if (entity) {
    entity.remove(function (error) {
      if (error) {
        handleError(res, 400, error);
      } else {
        respondWithResult(res, null, {message: 'Deleted!'});
      }
    });
  }
};
exports.removeEntity = removeEntity;

 var handleError = function (res, statusCode, error) {
  statusCode = statusCode || 500;
  if (error) {
    res.status(statusCode).json(error);
  }
};
exports.handleError = handleError;