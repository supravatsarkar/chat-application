// external modules
const express = require('express');
const router = express.Router();

//internal modules
const { getUsers } = require('../controller/usersController');
const decorateHtmlResponse = require('./../middlewares/common/decorateHtmlResponse');

// login Router
router.get('/', decorateHtmlResponse('Users'), getUsers);

// exports
module.exports = router;
