const express = require('express');

const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/userRoute');
const tourRouter = require('./routes/toursRoute');
const testRoute = require('./routes/testRoute');
const reviewsRouter = require('./routes/reviewsRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/test', testRoute);
app.all('*', (req, res, next) => {
  next(new AppError(`The route ${req.originalUrl} is not defined`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
