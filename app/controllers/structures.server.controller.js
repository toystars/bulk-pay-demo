/*
'use strict';

require('../api/department/departments.server.model.js');
require('../api/legal-entity/company.server.model.js');
require('../api/job-level/joblevel.server.model.js');
require('../api/position/position.server.model.js');
var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Department = mongoose.model('Departments'),
  JobLevel = mongoose.model('JobLevel'),
  Position = mongoose.model('Position');


/!*
* Departments
* *!/

exports.getAllDepartments = function (req, res) {
  Department.find(function (error, departments) {
    if (error) {
      res.json({message: 'No department found!'});
    }
    if (departments) {
      res.json(departments);
    }
  });
};

exports.createDepartment = function (req, res) {
  // check if companyId is present at first
  if (req.body.companyId) {
    Company.findOne({_id: req.body.companyId}, function (error, company) {
      if (error) {
        return res.status(400).json({message: 'Company not found'});
      } else {
        // check if code already exists in company departments database
        Department.findOne({ companyId: req.body.companyId, code: req.body.code }, function (error, department) {
          if (department) {
            return res.status(400).json({message: 'Code already in use by company'});
          } else {
            // create department
            var newDepartment = new Department(req.body);
            newDepartment.save(function (error, department) {
              if (error) {
                return res.status(400).json(error);
              }
              return res.status(200).json(department);
            });
          }
        });
      }
    });
  } else {
    return res.status(400).json({message: 'company Id is required!'});
  }
};

exports.getCompanyDepartments = function (req, res) {
  Department.find({companyId: req.params.companyId}, function (error, departments) {
    if (error) {
      return res.status(400).json(error);
    } else {
      return res.status(200).json(departments);
    }
  });
};

exports.getSingleDepartment = function (req, res) {
  Department.findOne({_id: req.params.id}, function (error, department) {
    if (error) {
      return res.status(400).json(error);
    } else {
      return res.status(200).json(department);
    }
  });
};

exports.editDepartment = function (req, res) {
  Department.findOne({_id: req.params.id, companyId: req.params.companyId}, function (error, department){
    if (error) {
      return res.status(400).json({ message: 'Department not found' });
    } else {
      for (var prop in req.body) {
        if (req.body.hasOwnProperty(prop)) {
          department[prop] = req.body[prop];
        }
      }
      department.save(function (error, department) {
        if (error) {
          return res.status(400).json(error);
        } else {
          return res.status(200).json(department);
        }
      });
    }
  });
};

exports.deleteDepartment = function (req, res) {
  Department.remove({_id: req.params.id, companyId: req.params.companyId}, function (error, department) {
    if (error) {
      return res.json({message: 'Internal server error'});
    }
    if (department) {
      res.json({message: 'Successfully deleted'});
    }
  });
};




/!*
* Job levels
* *!/

exports.getAllJobLevels = function (req, res) {
  JobLevel.find(function (error, jobLevels) {
    if (error) {
      res.json({message: 'No job level found!'});
    }
    if (jobLevels) {
      res.json(jobLevels);
    }
  });
};

exports.createJobLevel = function (req, res) {
  // check if user is present at first
  if (req.body.companyId) {
    Company.findOne({_id: req.body.companyId}, function (error, company) {
      if (error) {
        return res.status(400).json({message: 'Company not found'});
      } else {
        // check if code already exists in company departments database
        JobLevel.findOne({ companyId: req.body.companyId, code: req.body.code }, function (error, jobLevel) {
          if (jobLevel) {
            return res.status(400).json({message: 'Code already in use by company'});
          } else {
            // create department
            var newJobLevel = new JobLevel(req.body);
            newJobLevel.save(function (error, jobLevel) {
              if (error) {
                return res.status(400).json(error);
              }
              return res.status(200).json(jobLevel);
            });
          }
        });
      }
    });
  } else {
    return res.status(400).json({message: 'company Id is required!'});
  }
};

exports.getCompanyJobLevels = function (req, res) {
  JobLevel.find({companyId: req.params.companyId}, function (error, jobLevels) {
    if (error) {
      return res.status(400).json(error);
    } else {
      return res.status(200).json(jobLevels);
    }
  });
};

exports.getSingleJobLevel = function (req, res) {
  JobLevel.findOne({_id: req.params.id}, function (error, jobLevel) {
    if (error) {
      return res.status(400).json(error);
    } else {
      return res.status(200).json(jobLevel);
    }
  });
};

exports.editJobLevel = function (req, res) {
  JobLevel.findOne({_id: req.params.id, companyId: req.params.companyId}, function (error, jobLevel) {
    if (error) {
      return res.status(400).json({ message: 'Job level not found' });
    } else {
      for (var prop in req.body) {
        if (req.body.hasOwnProperty(prop)) {
          jobLevel[prop] = req.body[prop];
        }
      }
      jobLevel.save(function (error, jobLevel) {
        if (error) {
          return res.status(400).json(error);
        } else {
          return res.status(200).json(jobLevel);
        }
      });
    }
  });
};

exports.deleteJobLevel = function (req, res) {
  JobLevel.remove({_id: req.params.id, companyId: req.params.companyId}, function (error, jobLevel) {
    if (error) {
      return res.json({message: 'Internal server error'});
    }
    if (jobLevel) {
      res.json({message: 'Successfully deleted'});
    }
  });
};




/!*
 * Positions
 * *!/

exports.getAllPositions = function (req, res) {
  Position.find(function (error, position) {
    if (error) {
      res.json({message: 'No position found!'});
    }
    if (jobLevels) {
      res.json(position);
    }
  });
};

exports.createPosition = function (req, res) {
  // check if company is present at first
  if (req.body.companyId) {
    Company.findOne({_id: req.body.companyId}, function (error, company) {
      if (error) {
        return res.status(400).json({message: 'Company not found'});
      } else {
        // create position
        var newPosition = new Position(req.body);
        newPosition.save(function (error, position) {
          if (error) {
            return res.status(400).json(error);
          }
          return res.status(200).json(position);
        });
      }
    });
  } else {
    return res.status(400).json({message: 'company Id is required!'});
  }
};

exports.getCompanyPositions = function (req, res) {
  Position.find({companyId: req.params.companyId}, function (error, positions) {
    if (error) {
      return res.status(400).json(error);
    } else {
      return res.status(200).json(positions);
    }
  });
};

exports.getSinglePosition = function (req, res) {
  Position.findOne({_id: req.params.id}, function (error, position) {
    if (error) {
      return res.status(400).json(error);
    } else {
      return res.status(200).json(position);
    }
  });
};

exports.editPosition = function (req, res) {
  Position.findOne({_id: req.params.id, companyId: req.params.companyId}, function (error, position) {
    if (error) {
      return res.status(400).json({ message: 'Position not found' });
    } else {
      for (var prop in req.body) {
        if (req.body.hasOwnProperty(prop)) {
          position[prop] = req.body[prop];
        }
      }
      position.save(function (error, position) {
        if (error) {
          return res.status(400).json(error);
        } else {
          return res.status(200).json(position);
        }
      });
    }
  });
};

exports.deletePosition = function (req, res) {
  Position.remove({_id: req.params.id, companyId: req.params.companyId}, function (error, position) {
    if (error) {
      return res.json({message: 'Internal server error'});
    }
    if (position) {
      res.json({message: 'Successfully deleted'});
    }
  });
};*/
