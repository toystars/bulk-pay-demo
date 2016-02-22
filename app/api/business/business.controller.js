/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/businesses              ->  index
 * POST    /api/businesses              ->  create
 * GET     /api/businesses/:id          ->  show
 * PUT     /api/businesses/:id          ->  update
 * DELETE  /api/businesses/:id          ->  destroy
 */

'use strict';

require('../user/user.model.js');
require('./business.model.js');
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Business = mongoose.model('Business'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all businesses
 */
exports.index = function (req, res) {
  var userId = req.user._id;
  Business.find({ creatorId: userId }).populate('creator').exec(function (error, businesses) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (businesses) {
      crudHelper.respondWithResult(res, null, businesses);
    }
  });
};

/*
* Create new business
* */
exports.create = function (req, res) {
  var newBusiness = new Business(req.body);
  newBusiness.save(function (error, business) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      var user = req.user;
      user.businesses.push(business._id);
      user.save(function (error, user) {
        if (error) {
          crudHelper.handleError(res, 400, error);
        } else {
          crudHelper.respondWithResult(res, 201, business);
        }
      });
    }
  });
};

/*
* Fetch a business
* */
exports.show = function (req, res) {
  var businessId = req.params.id;
  Business.findOne({ _id: businessId }).populate('creator').exec(function (error, business) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (business) {
      crudHelper.respondWithResult(res, null, business);
    } else {
      crudHelper.handleError(res, null, { message: 'Business not found!' });
    }
  });
};

/*
* Update single business
* */
exports.updateBusiness = function (req, res) {
  var businessId = req.params.id;
  delete req.body.creator;
  Business.findOne({ _id: businessId }, '-creator', function (error, business) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, business, true);
    }
  });
};


/*
'use strict';

require('../user/users.server.model.js');
require('company.server.model.js');
var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  User = mongoose.model('Users');

exports.getAllCompanies = function (req, res) {
  Company.find(function (error, companies) {
    if (error) {
      res.json({message: 'No company found!'});
    }
    if (companies) {
      res.json(companies);
    }
  });
};

exports.createCompany = function (req, res) {
  // check if user is present at first
  if (req.body.userId) {
    User.findOne({_id: req.body.userId}, function (error, user) {
      if (error) {
        return res.status(400).json({message: 'User not found'});
      } else {
        // check if user already has company
        Company.findOne({userId: user._id}, function (error, company) {
          if (company) {
            return res.status(400).json({message: 'Company already set up for user'});
          }
          // create company for user
          var newCompany = new Company(req.body);
          newCompany.save(function (error, company) {
            if (error) {
              return res.status(400).json(error);
            }
            return res.status(200).json(company);
          });
        });
      }
    })
  } else {
    return res.status(400).json({message: 'userId is required!'});
  }
};

exports.getUserCompany = function (req, res) {
  Company.findOne({userId: req.params.id}, function (error, company) {
    if (error) {
      return res.status(400).json({message: 'Company not found'});
    } else {
      return res.status(200).json(company);
    }
  });
};


exports.deleteCompany = function (req, res) {
  Company.remove({_id: req.params.id}, function (error, type) {
    if (error) {
      return res.json({message: 'Internal server error'});
    }
    if (type) {
      res.json({message: 'Successfully deleted'});
    }
  });
};
*/
