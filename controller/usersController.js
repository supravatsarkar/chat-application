const bcrypt = require('bcrypt');
const User = require('./../models/People');
const fs = require('fs');
const path = require('path');

// get users page
async function getUsers(req, res, next) {
  try {
    const users = await User.find();
    res.render('users', {
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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (req.files && req.files.length > 0) {
      newUser = User({
        ...req.body,
        password: hashedPassword,
        avatar: req.files[0].filename,
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
      message: 'User added successfully!',
    });
  } catch (error) {
    console.log('Unknown error: ', error);
    res.status(500).json({
      error: {
        common: {
          msg: 'Unknown error occurred!',
        },
      },
    });
  }
}

// remove user
async function removeUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id });

    //remove user avatar
    if (user.avatar) {
      fs.unlink(
        path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
        (err) => {
          if (err) console.log('avatar unlink error when delete avatar:', err);
        }
      );
    }
    res.status(200).json({
      msg: 'User deleted success!',
    });
  } catch (error) {
    res.status(500).json({
      error: {
        common: {
          msg: 'Something went wrong',
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
