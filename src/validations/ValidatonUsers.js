import { body } from 'express-validator';
import userModel from '../models/Users.js';

const registerFieldRules = () => [
  body('first_name')
    .notEmpty()
    .withMessage('first_name cannot empty')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage('Username min 3 & max 100'),
  body('last_name')
    .notEmpty()
    .withMessage('last_name cannot empty')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage('Username min 3 & max 100'),
];

const rulesPassword = () => [
  body('password')
    .notEmpty()
    .withMessage('Password cannot empty')
    .bail()
    .isLength({ min: 4, max: 15 })
    .withMessage('Password min 4 & max 15'),
];

const registerEmail = () => [
  body('email')
    .notEmpty()
    .withMessage('Email cannot empty')
    .bail()
    .isEmail()
    .withMessage('Your email is invalid')
    .bail()
    .custom(async (value) => {
      const existingEmail = await userModel.checkExistUser(value, 'email');
      if (existingEmail.length > 0) {
        throw new Error('e-mail already registered');
      }
      return true;
    }),
];

const updateEmail = () => [
  body('email')
    .optional({ checkFalsy: true })
    .bail()
    .isEmail()
    .withMessage('Your email is invalid')
    .bail()
    .custom(async (value) => {
      const existingEmail = await userModel.checkExistUser(value, 'email');
      if (existingEmail.length > 0) {
        throw new Error('e-mail already registered');
      }
      return true;
    }),
];

const rulesFileUploud = (req, res, next) => {
  if (req.files) {
    if (req.files.image) {
      delete req.files.image.data;
      req.body.image = { ...req.files.image };
    }
  }
  next();
};

const rulesUpdateImageProfile = () => [
  body('image')
    .optional({ checkFalsy: false })
    .bail()
    .custom((value) => {
      if (value.mimetype !== 'image/png' && value.mimetype !== 'image/jpeg') {
        throw new Error('image must be jpg or png');
      }
      return true;
    })
    .bail()
    .custom((value) => {
      if (parseInt(value.size, 10) > 5242880) {
        throw new Error('image size exceeds 5 megabytes');
      }
      return true;
    }),
];

const PINRules = () => [
  body('PIN')
    .notEmpty()
    .withMessage("PIN can't empty")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage('PIN must consist of 6 digits')
    .bail()
    .isNumeric()
    .withMessage('PIN must be number'),
];

const emailRules = () => [
  body('email')
    .notEmpty()
    .withMessage('Email cannot empty')
    .bail()
    .isEmail()
    .withMessage('Your email is invalid')
    .bail()
    .custom(async (value) => {
      const existingEmail = await userModel.checkExistUser(value, 'email');
      if (existingEmail.length <= 0) {
        throw new Error('e-mail not found');
      }
      return true;
    }),
];

const changePasswordRules = () => [
  body('password')
    .notEmpty()
    .withMessage('Please insert new password')
    .bail()
    .isLength({ min: 4, max: 15 })
    .withMessage('Password min 4 & max 15'),
  body('password2')
    .notEmpty()
    .withMessage('Please insert compare password')
    .bail()
    .isLength({ min: 4, max: 15 })
    .withMessage('Password min 4 & max 15'),
];

const loginFieldRules = () => [
  body('email')
    .notEmpty()
    .withMessage('Please enter your email')
    .bail()
    .isEmail()
    .withMessage('Your email is invalid')
    .bail()
    .custom(async (value) => {
      const existingEmail = await userModel.checkExistUser(value, 'email');
      if (existingEmail.length <= 0) {
        throw new Error('Your email not found');
      }
      return true;
    }),
  body('password').notEmpty().withMessage('Please enter your password'),
];

export {
  registerFieldRules,
  PINRules,
  emailRules,
  changePasswordRules,
  loginFieldRules,
  rulesUpdateImageProfile,
  rulesFileUploud,
  rulesPassword,
  updateEmail,
  registerEmail,
};
