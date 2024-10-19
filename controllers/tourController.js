const Tour = require('../models/tourModel');
const factory = require('./handlerFactory');

exports.topFive = (req, res, next) => {
  req.query.sort = '-ratingAverage,price';
  req.query.limit = '5';
  req.query.filter = 'name,price,difficulty,duration';

  next();
};

exports.getAllTours = factory.getAll(Tour);

exports.createTour = factory.createOne(Tour);

exports.getTour = factory.getOne(Tour, 'reviews');

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);
