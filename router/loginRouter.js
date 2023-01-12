// external modules
const express = require('express');
const router = express.Router();

//internal modules
const { getLogin } = require('./../controller/loginController');
const decorateHtmlResponse = require('./../middlewares/common/decorateHtmlResponse');

// login Router
router.get('/', decorateHtmlResponse('Login'), getLogin);

// exports
module.exports = router;
