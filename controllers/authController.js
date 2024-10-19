const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role || undefined,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  console.log('Hello WOrld');
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide an email and password'), 400);
  }
  // 1) check if the email is found
  const user = await User.findOne({ email: email }).select('+password');
  //2) check if the passwrod is correct
  const correct = await user.correctPassword(password, user.password);
  //3) send JWT
  if (!user || !correct) {
    return next(new AppError('Password or email is incorrect', 401));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You need to login to continue'), 401);
  }
  // 2) token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check user if still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('User is no longer exist!'), 401);
  }
  // 4) check if user changed password after toke was issued
  req.user = freshUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    console.log(req.user, roles);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not allowed to perform this action'),
        403,
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Capture User's Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email'), 401);
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 2) Generate Random Token
  // 3) Send token to user's email
});

exports.resetPassword = (req, res, next) => {};
