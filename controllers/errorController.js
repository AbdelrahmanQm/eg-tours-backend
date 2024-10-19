const AppError = require('../utils/appError');

const handleCastError = (err) =>
  new AppError(`${err.path}: ${err.value} is incorrect!`);

const handleDuplicateError = (err) =>
  new AppError(`The name <${err.keyValue.name}> is already in use`, 400);

const handleValidationError = (err) => {
  const message = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Error validating data: ${message.join('. ')}`, 400);
};
const handleJWTError = () =>
  new AppError('Invalid token, please login again to continue', 401);

const handleJWTExpiredError = () =>
  new AppError('Login session expired, please log in again.', 401);
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateError(error);
    if (error._message === 'Tour validation failed')
      error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    sendErrorProd(error, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  next();
};
