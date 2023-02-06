// internal exports
const Conversation = require("../models/Conversation");
const escape = require("./../utilities/escape");
const User = require("./../models/People");
const Message = require("./../models/Message");
const { hostImageToImageBB } = require("../utilities/hostImage");

// get inbox page
async function getInbox(req, res, next) {
  console.log("hit get inbox controller");
  try {
    const conversations = await Conversation.find({
      $or: [
        { "creator.id": req.user.userid },
        { "participant.id": req.user.userid },
      ],
    });
    res.locals.data = conversations;
    res.render("inbox");
  } catch (err) {
    next(err);
  }
}

// search user
async function searchUser(req, res, next) {
  const user = req.body.user;
  const searchQuery = user.replace("+91", "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + escape("+91" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

  try {
    if (searchQuery !== "") {
      console.log("req.user.email", req.user.email);
      const users = await User.find(
        {
          $or: [
            {
              name: name_search_regex,
            },
            {
              mobile: mobile_search_regex,
            },
            {
              email: email_search_regex,
            },
          ],
          email: { $ne: req.user.email },
        },
        "name avatar"
      );

      console.log("searches users:-", users);

      res.json(users);
    } else {
      throw createError("You must provide some text to search!");
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// add conversation
async function addConversation(req, res, next) {
  try {
    const findConversation = await Conversation.findOne({
      $or: [
        { "creator.id": req.user.userid, "participant.id": req.body.id },
        {
          "creator.id": req.body.id,
          "participant.id": req.user.userid,
        },
      ],
    });
    console.log("findConversation", findConversation);
    if (!findConversation) {
      const newConversation = new Conversation({
        creator: {
          id: req.user.userid,
          name: req.user.userName,
          avatar: req.user.avatar || null,
        },
        participant: {
          name: req.body.participant,
          id: req.body.id,
          avatar: req.body.avatar || null,
        },
      });

      const result = await newConversation.save();
      console.log("conversation save result=>", result);
    }
    res.status(200).json({
      message: "Conversation was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

async function deleteConversation(req, res, next) {
  try {
    console.log("hit deleteConversation controller");
    console.log("conversationId=>", req.body.conversationId);
    if (req.body.conversationId) {
      const result = await Conversation.findByIdAndDelete({
        _id: req.body.conversationId,
      });
      res.status(200).json({
        msg: "Delete success!",
        result,
      });
    } else {
      res.status(500).json({
        errors: {
          common: {
            msg: "conversation id required!",
          },
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Something went wrong!",
        },
      },
    });
  }
}

// get messages of a conversation
async function getMessages(req, res, next) {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknows error occured!",
        },
      },
    });
  }
}

async function sendMessage(req, res, next) {
  console.log("hit sendMessage controller");
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      // save message text/attachment in databases
      let attachments = null;
      let promises = [];
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          try {
            const link = hostImageToImageBB(
              req.files[i].filename,
              "attachments"
            );
            promises.push(link);
          } catch (error) {
            console.log("err", error);
            attachments.push(null);
          }
        }
      }

      attachments = await Promise.all(promises);
      console.log("attachments=>", attachments);

      const newMessage = new Message({
        text: req.body.message,
        attachment: attachments,
        sender: {
          id: req.user.userid,
          name: req.user.userName,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });
      const result = await newMessage.save();

      // emit socket event
      global.io.emit("new_message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: req.user.userid,
            name: req.user.userName,
            avatar: req.user.avatar || null,
          },
          receiver: {
            id: req.body.receiverId,
            name: req.body.receiverName,
            avatar: req.body.avatar || null,
          },
          message: req.body.message,
          attachment: attachments,
          date_time: result.date_time,
        },
      });

      console.log("msg save success", result);
      // send response
      res.status(200).json({
        message: "Successful!",
        data: result,
      });
    } catch (error) {
      console.log("save msg error:=>", error);
      res.status(500).json({
        errors: {
          common: {
            msg: error.message,
          },
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: {
          msg: "Message text or attachment is required",
        },
      },
    });
  }
}

module.exports = {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
  deleteConversation,
};
