/*
'use strict';

require('scales.server.model.js');
var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Scale = mongoose.model('Scales');

exports.getAllPayScales = function(req, res) {
  Scale.find(function(error, scales){
    if (error) {
      res.json({message: 'No pay scale type found!'});
    }
    if (types) {
      res.json(scales);
    }
  });
};

exports.getCompanyPayScales = function(req, res) {
  Scale.find({companyId: req.params.companyId}, function(error, scales){
    if (error) {
      res.json({message: 'No pay scale found!'});
    }
    if (scales) {
      res.json(scales);
    }
  });
};

exports.createPayScale = function (req, res) {
  if (req.body.companyId) {
    Company.findOne({_id: req.body.companyId}, function (error, company) {
      if (error) {
        return res.status(400).json({message: 'Company not found'});
      } else {
        // check if code already exists in company departments database
        Scale.findOne({ companyId: req.body.companyId, code: req.body.code }, function (error, scale) {
          if (scale) {
            return res.status(400).json({ message: 'Code already in use by company' });
          } else {
            var newScale = new Scale(req.body);
            newScale.save(function (error, scale) {
              if (error) {
                return res.status(400).json(error);
              }
              return res.status(200).json(scale);
            });
          }
        });
      }
    });
  } else {
    return res.status(400).json({message: 'company Id is required!'});
  }
};

exports.updatePayScale = function (req, res) {
  Scale.findOne({_id: req.params.id}, function (error, scale){
    if (error) {
      return res.status(400).json({ message: 'Pay scale not found' });
    } else {
      for (var prop in req.body) {
        if (req.body.hasOwnProperty(prop)) {
          scale[prop] = req.body[prop];
        }
      }
      scale.save(function (error, scale) {
        if (err) {
          return res.status(400).json(error);
        } else {
          return res.status(200).json(scale);
        }
      });
    }
  });
};

exports.deletePayScale = function (req, res) {
  Scale.remove({ _id: req.params.id }, function (error, scale) {
    if (error) {
      return res.json({message: 'Internal server error'});
    }
    if (scale) {
      res.json({ message: 'Successfully deleted' });
    }
  });
};
*/
