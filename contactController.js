// contactController.js
// Import contact model
Contact = require('./contactModel');

// For Task C - JSON Web Token dependency
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Token secret is either from a .env file or configured on the platform (Heroku, etc.)
if (process.env.TOKEN_SECRET) {
} else {
  dotenv.config();
}

// Token related functions
function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: 1800 });
}

exports.authenticateToken = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]
  
  if (token == null) {
    return res.sendStatus(401);
  }
  
  jwt.verify(token, process.env.TOKEN_SECRET as string, (err, user) => {
    console.log(err);
    
    if (err) {
      return res.sendStatus(403);
    }
    
    req.user = user;
    next();
  });
}


// Endpoint functions
exports.index = function(req, res) {
    Contact.get(function (err, contacts) {
        if (err) {
			res.status(418);
            res.json({
                message: err,
            });
        } else {
			res.status(200);
			res.json({
				message: "Contacts retrieved successfully",
				data: contacts
			});
		}
    });
};
// Handle create contact actions
exports.new = function(req, res) {
    var contact = new Contact();
    contact.name = req.body.name ? req.body.name : contact.name;
    contact.gender = req.body.gender;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
	// save the contact and check for errors
    contact.save(function (err) {
        // Check for validation error
        if (err) {
			res.status(418);
		    res.json({
				message: err
			});
		} else {
            res.json({
                message: 'New contact created!',
                data: contact
            });
		}
    });
};
// Handle view contact info
exports.view = function(req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err) {
			res.status(418);
            res.json({
				message: err
			});
		} else {
			res.status(200);
			res.json({
				message: 'Contact details loading..',
				data: contact
			});
		}
    });
};
// Handle update contact info
exports.update = function(req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err) {
			res.status(418);
            res.json({
				message: err
			});
		} else {
			// Handle case where contact_id is a valid id, but no such Contact
			// exists.
			if (contact == null) {
				res.status(418);
				res.json({
					message: 'Unable to find contact with that id'
				});
				return;
			}
			contact.name = req.body.name ? req.body.name : contact.name;
			contact.gender = req.body.gender;
			contact.email = req.body.email;
			contact.phone = req.body.phone;
			// save the contact and check for errors
			contact.save(function (err) {
				if (err) {
					res.status(418);
					res.json(err);
				} else {
					res.json({
						message: 'Contact Info updated',
						data: contact
					});
				}
			});
		}
    });
};
// Handle delete contact
exports.delete = function(req, res) {
    Contact.remove({
        _id: req.params.contact_id
    }, function (err, contact) {
		// Handles edge case where app would otherwise crash if 
		// a malformed client id was sent as a parameter.
        if (err) {
			res.status(418);
			res.json({
				message: 'Failed to delete contact'
			});
		} else {
			res.status(200);
			res.json({
				message: 'Contact deleted'
			});
		}
    });
};

exports.deleteAll = function(req, res) {
	Contact.remove({}, function(err) {
		if (err) {
			res.status(418);
			res.json({
				message: err
			});
		} else {
			res.status(200);
			res.json({
				message: 'Deleted all contacts'
			});
		}
	});
};

exports.taskC = function(req, res) {
  res.status(200);
  res.json({
    message: 'Hi, you\'ve reached the Task C endpoint!'
  });
};