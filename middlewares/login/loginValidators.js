const { check, validationResult } = require('express-validator');
const loginValidator = [
  check('username').isLength({ min: 1 }).withMessage('Username is required'),
  check('password').isLength({ min: 1 }).withMessage('Password is required'),
];

function loginValidatorHandler(req, res, next) {
  console.log('Login validator handler');
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  console.log('mappedErrors=>', mappedErrors);
  if (Object.keys(mappedErrors).length === 0) {
    console.log('next call');
    next();
  } else {
    res.render('index', {
      data: {
        username: req.body.username,
      },
      error: mappedErrors,
    });
  }
}

module.exports = {
  loginValidator,
  loginValidatorHandler,
};
