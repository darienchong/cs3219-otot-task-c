const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const Role = require('./role');
const dotenv = require('dotenv');

// Setup token secret. Either the token secret is in an .env file, or
// it is configured manually on the platform (e.g. Heroku).
if (process.env.TOKEN_SECRET) {
} else {
  dotenv.config();
}

function getUser(username, password) {
  return searchDatabaseForUser(username, password);
}

function searchDatabaseForUser(username, password) {
  // In an actual production environment, this function would wrap a query
  // to some database of users. For simplicity, it is hardcoded here.  
  const users = [
    { id: 1, username: 'admin', password: 'admin', role: Role.Admin },
    { id: 2, username: 'user', password: 'user', role: Role.User }  
  ];
  return users.find(user => user.username === username && user.password === password);
}

module.exports = {
  authenticate,
  authorise
};

// Returns a JWT if the user details (username, password) are valid.
async function authenticate(username, password) {
  const user = getUser(username, password);
  if (user) {
    const token = jwt.sign({
      sub: user.id,
      role: user.role
    }, process.env.TOKEN_SECRET);
    
    return token;
  }
}

// roles can either be a single role e.g. Role.Admin, or
// an array of roles allowed.
// This function returns a middleware function that
// checks if the user is allowed to access the route based on their role.
function authorise(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return [
    // Use module to validate JWT and attach decoded JWT payload to request object (req.user)
    expressJwt({
      secret: process.env.TOKEN_SECRET,
      algorithms: ['HS256']
    }),
    (req, res, next) => {
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Your role (' + req.user.role + ') does not allow you to perform this action.' });
      }
      
      next();
    }
  ]
}