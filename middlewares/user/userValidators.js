const { check, validationResult } = require('express-validator');
const createHttpError = require('http-errors');
const User = require('./../../models/People');
const { unlink } = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// add user
const addUserValidators = [
  check('name')
    .isLength({ min: 1 })
    .withMessage('Name is required')
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Name must no contain anything other that alphabet')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('Invalid email address')
    .trim()
    .custom(async (value) => {
      try {
        console.log('email value=>', value);
        const user = await User.findOne({ email: value });
        if (user) {
          throw createHttpError('Email already exist');
        }
      } catch (error) {
        throw createHttpError(error.message);
      }
    }),
  check('mobile')
    .isMobilePhone('en-IN', {
      strictMode: true,
    })
    .withMessage('Mobile number must be a Indian mobile number')
    .custom(async (value) => {
      try {
        console.log('email value=>', value);
        const user = await User.findOne({
          mobile: value,
        });

        if (user) {
          // console.log('user=>', user);
          throw createHttpError('Mobile number already in use');
        }
      } catch (error) {
        throw createHttpError(error.message);
      }
    }),
  check('password')
    .isStrongPassword()
    .withMessage(
      'Password must be at least 8 char long & at least 1 lowercase, 1 uppercase & 1 symbol'
    ),
];

const addUserValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  console.log('mappedErrors=>', mappedErrors);
  console.log('Object.keys(mappedErrors)=>', Object.keys(mappedErrors));
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    //remove upload file
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      console.log('filename', filename);
      console.log('req.files[0]', req.files[0]);
      unlink(req.files[0].path, (err) => {
        if (err) console.log('File unlink error: ', err);
      });
    }
    // response the errors
    console.log('errors=>', errors);
    res.status(500).json({
      errors: mappedErrors,
    });
  }
};
const removeUserValidation = function () {
  const validation = [
    check('id')
      .isLength({ min: 1 })
      .withMessage('id is required')
      .custom(async (value) => {
        try {
          console.log('id value=>', value);
          const isValidId = mongoose.Types.ObjectId.isValid(value);
          console.log('isValidId=>', isValidId);
          if (isValidId) {
            const user = await User.findOne({ _id: value });
            console.log('user-', user);
            if (!user) {
              // console.log('user=>', user);
              throw createHttpError('User is not exist');
            }
          } else {
            throw createHttpError('Invalid user id!');
          }
        } catch (error) {
          console.log('errror', error);
          throw createHttpError(error.message);
        }
      }),
  ];
  return [
    ...validation,
    function (req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('errors=>', errors);
        next(errors);
      } else {
        next();
      }
    },
  ];
};
module.exports = {
  addUserValidators,
  addUserValidationHandler,
  removeUserValidation,
};
