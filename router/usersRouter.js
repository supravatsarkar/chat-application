// external modules
const express = require('express');
const router = express.Router();

//internal modules
const {
  getUsers,
  addUser,
  removeUser,
} = require('../controller/usersController');
const decorateHtmlResponse = require('./../middlewares/common/decorateHtmlResponse');
const avatarUpload = require('./../middlewares/user/avatarUpload');
const {
  addUserValidators,
  addUserValidationHandler,
} = require('./../middlewares/user/userValidators');

// login Router
router.get('/', decorateHtmlResponse('Users'), getUsers);
//add user
router.post(
  '/',
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);
router.delete('/:id', removeUser);

// exports
module.exports = router;
