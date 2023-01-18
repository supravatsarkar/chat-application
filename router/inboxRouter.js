// external modules
const express = require('express');
const router = express.Router();

//internal modules
const { getInbox } = require('../controller/inboxController');
const decorateHtmlResponse = require('./../middlewares/common/decorateHtmlResponse');
const { checkLogin } = require('./../middlewares/common/checkLogin');

// login Router
router.get('/', decorateHtmlResponse('Inbox'), checkLogin, getInbox);

// exports
module.exports = router;
