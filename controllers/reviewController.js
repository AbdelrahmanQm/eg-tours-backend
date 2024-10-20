const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const review = await Review.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});
exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
