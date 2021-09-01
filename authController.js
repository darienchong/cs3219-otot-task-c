const express = require('express');
const router = express.Router();
const authService = require('./authService');
const Role = require('./Role');

function authenticate(req, res, next) {
  authService.authenticate(req.body.username, req.body.password)
    .then(user => {
      if (user) {
        res.status(200)
          .json(user);
      } else {
        res.status(400)
          .json({
            message: 'Username or password is incorrect'
          });
      }
    })
    .catch(err => {
      next(err)
    });
}

function adminOnly(req, res, next) {
  res.status(200)
    .json({
      message: 'Admin only endpoint'
    });
  next();
}

function userOnly(req, res, next) {
  res.status(200)
    .json({
      message: 'User only endpoint'
    });
  next();
}

function bothAdminAndUser(req, res, next) {
  res.status(200)
    .json({
      message: 'Both admin and users can access this endpoint'
    });
  next();
}

router.post('/auth', authenticate); // Public authentication endpoint to get JWT 
router.get('/admin', authService.authorise(Role.Admin), adminOnly);
router.get('/user', authService.authorise(Role.User), userOnly);
router.get('/both', authService.authorise([Role.Admin, Role.User]), bothAdminAndUser);

module.exports = router;