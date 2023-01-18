// internal module
const User = require('./../models/People');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');

// get login page
function getLogin(req, res, next) {
  res.render('index', {
    title: 'Login - Chat Application',
  });
}

// do login
async function login(req, res, next) {
  try {
    console.log('login controller', req.body);
    // find user who has email/phone
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });
    console.log('user:', user);
    if (user && user._id) {
      // compare password
      console.log('req.body.password', req.body.password);
      console.log('user.password', user.password);
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      console.log('isValidPassword:', isValidPassword);
      if (isValidPassword) {
        // prepare the user object for generate token
        const userObject = {
          userName: user.name,
          email: user.email,
          mobile: user.mobile,
          role: 'user',
        };
        // generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });
        console.log('login jwt token:=', token);
        console.log('process.env.JWT_EXPIRY', process.env.JWT_EXPIRY);

        // set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
        });
        // res.cookie('test_cookie', 'xxdx', {
        //   maxAge: process.env.JWT_EXPIRY,
        //   httpOnly: true,
        //   signed: true,
        // });
        // set local to identify the user
        res.locals.loggedInUser = userObject;

        res.render('inbox');
      } else {
        throw createHttpError('Login Failed! Password not matched');
      }
    } else {
      throw createHttpError('Login Failed! User not exist');
    }
  } catch (err) {
    console.log('login error:', err);
    res.render('index', {
      data: {
        username: req.body.username,
      },
      error: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

function logout(req, res) {
  console.log('Logout controller');
  res.clearCookie(process.env.COOKIE_NAME);
  res.send('Log out!');
}

module.exports = {
  getLogin,
  login,
  logout,
};
