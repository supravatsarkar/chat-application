// external modules
const express = require('express');
const router = express.Router();

//internal modules
const { getLogin, login, logout } = require('./../controller/loginController');
const decorateHtmlResponse = require('./../middlewares/common/decorateHtmlResponse');
const {
  loginValidator,
  loginValidatorHandler,
} = require('./../middlewares/login/loginValidators');
const { redirectLogin } = require('./../middlewares/common/checkLogin');

//page title
const page_title = 'Login';

// get login page
router.get('/', decorateHtmlResponse(page_title), redirectLogin, getLogin);

// do login
router.post(
  '/',
  decorateHtmlResponse(page_title),
  loginValidator,
  loginValidatorHandler,
  login
);

//do logout
router.delete('/', logout);

// exports
module.exports = router;
