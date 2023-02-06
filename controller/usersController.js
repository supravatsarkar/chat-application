const bcrypt = require("bcrypt");
const User = require("./../models/People");
const fs = require("fs");
const path = require("path");
const { hostImageToImageBB } = require("../utilities/hostImage");

// get users page
async function getUsers(req, res, next) {
  try {
    const users = await User.find();
    res.render("users", {
      users: users,
    });
  } catch (error) {
    next(error);
  }
}

// add user
async function addUser(req, res, next) {
  try {
    let newUser;
    console.log("password before hash=>", req.body.password);
    console.log("password before hash=>", typeof req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (req.files && req.files.length > 0) {
      // console.log("add user req.files", req.files);
      const imageLink = await hostImageToImageBB(
        req.files[0].filename,
        "avatars"
      );
      console.log("imageLink", imageLink);
      newUser = User({
        ...req.body,
        password: hashedPassword,
        avatar: imageLink,
      });
    } else {
      newUser = User({
        ...req.body,
        password: hashedPassword,
      });
    }
    // save user
    const result = await newUser.save();
    res.status(200).json({
      message: "User added successfully!",
    });
  } catch (error) {
    console.log("Unknown error: ", error);
    res.status(500).json({
      error: {
        common: {
          msg: "Unknown error occurred!",
        },
      },
    });
  }
}

// remove user
async function removeUser(req, res, next) {
  try {
    console.log("req.params.id->", req.params.id);

    let user = await User.findById({ _id: req.params.id });

    console.log("user.role->", user.role);
    console.log("user.role is admin->", user.role == "admin");
    if (user.role == "admin") {
      console.log("Admin is not deletable!", user);
      return res.status(500).json({
        error: {
          common: {
            msg: "Admin is not deletable!",
          },
        },
      });
    }
    user = await User.findByIdAndDelete({ _id: req.params.id });
    // check if it admin

    //remove user avatar
    if (user.avatar) {
      fs.unlink(
        path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
        (err) => {
          if (err) console.log("avatar unlink error when delete avatar:", err);
        }
      );
    }
    res.status(200).json({
      msg: "User deleted success!",
    });
  } catch (error) {
    console.log("error while remove user:-", error);
    res.status(500).json({
      error: {
        common: {
          msg: "Something went wrong",
        },
      },
    });
  }
}
module.exports = {
  getUsers,
  addUser,
  removeUser,
};
