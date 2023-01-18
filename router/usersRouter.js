// external modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const createHttpError = require('http-errors');
const User = require('./../models/People');
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
  removeUserValidation,
} = require('./../middlewares/user/userValidators');

const { checkLogin } = require('./../middlewares/common/checkLogin');

// login Router
router.get('/', decorateHtmlResponse('Users'), checkLogin, getUsers);
//add user
router.post(
  '/',
  checkLogin,
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);
router.delete('/:id', checkLogin, removeUserValidation(), removeUser);

// exports
module.exports = router;
