// external modules
const express = require('express');
const router = express.Router();

//internal modules
const { getInbox } = require('../controller/inboxController');
const decorateHtmlResponse = require('./../middlewares/common/decorateHtmlResponse');

// login Router
router.get('/', decorateHtmlResponse('Inbox'), getInbox);

// exports
module.exports = router;
