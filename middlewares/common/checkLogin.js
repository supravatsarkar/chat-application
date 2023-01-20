const jwt = require('jsonwebtoken');
const createError = require('http-errors');
function checkLogin(req, res, next) {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  console.log('cookies=>', cookies);
  if (cookies) {
    try {
      let token = cookies[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // pass user info to local
      if (res.locals.html) {
        res.locals.loggedInUser = decoded;
      }
      next();
    } catch (error) {
      if (res.locals.html) {
        res.redirect('/');
      } else {
        res.status(500).json({
          error: {
            common: {
              msg: 'Authentication failure!',
            },
          },
        });
      }
    }
  } else {
    if (res.locals.html) {
      res.redirect('/');
    } else {
      res.status(401).json({
        error: {
          common: {
            msg: 'Authentication failure!',
          },
        },
      });
    }
  }
}

function redirectLogin(req, res, next) {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  try {
    let token = cookies[process.env.COOKIE_NAME];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.userName) {
      res.redirect('/inbox');
    } else {
      next();
    }
  } catch (error) {
    next();
  }
}

function requireRole(roles) {
  return function (req, res, next) {
    // console.log('req.user=>', req.user);
    // console.log('roles=>', roles);
    if (req.user.role && roles.includes(req.user.role)) {
      next();
    } else {
      if (res.locals.html) {
        next(createError(401, 'You are not authorized to access this page!'));
      } else {
        res.status(401).json({
          errors: {
            common: {
              msg: 'You are not authorized!',
            },
          },
        });
      }
    }
  };
}

module.exports = {
  checkLogin,
  redirectLogin,
  requireRole,
};
