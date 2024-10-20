const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'A review must have text!'] },
    rating: {
      type: Number,
      required: [true, 'You must enter a rating'],
      max: [
        5,
        'A review rating is out of 5, so you cannot enter a number more than 5!',
      ],
      min: [1, 'A review rating must be at least 1!'],
    },
    createdAt: Date,
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Your review must be pointing to a tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: 'A review must be written by a user!',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.static.calcAverageRating = async (tourId) => {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: 'tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.tour);
});
reviewSchema.pre(/^findOneById/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRating(this.r.tour);
});

reviewSchema.pre('save', function (next) {
  this.createdAt = new Date();
  next();
});
reviewSchema.pre(/^find/, function (next) {
  this.populate('user');
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
