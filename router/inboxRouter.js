// external modules
const express = require('express');
const router = express.Router();

//internal modules
const {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
  deleteConversation,
} = require('../controller/inboxController');
const decorateHtmlResponse = require('./../middlewares/common/decorateHtmlResponse');
const { checkLogin } = require('./../middlewares/common/checkLogin');
const attachmentUpload = require('./../middlewares/inbox/attachmentUpload');

// login Router
router.get('/', decorateHtmlResponse('Inbox'), checkLogin, getInbox);

// search user for conversation
router.post('/search', checkLogin, searchUser);

// add conversation
router.post('/conversation', checkLogin, addConversation);

// delete a conversation
router.delete('/conversation', checkLogin, deleteConversation);

// get messages of a conversation
router.get('/messages/:conversation_id', checkLogin, getMessages);

// send message
router.post('/message', checkLogin, attachmentUpload, sendMessage);

// exports
module.exports = router;
