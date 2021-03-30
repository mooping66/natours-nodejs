const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//@@ Finishing Payments with Stripe Webhooks
exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later.";
  }
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  //@@ Building the Tour Overview - Part 1
  //* 1. Get tour data from collection
  const tours = await Tour.find();

  //* 2. Build template
  //* 3. Render that template using tour data from 1
  res.status(200).render('overview', { title: 'All Tours', tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //@@ Building the Tour Page - Part 1
  //* 1. Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  //@@ Rendering Error Pages
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  //* 2. Build template
  //* 3. Render that template using data from 1
  res.status(200).render('tour', { title: `${tour.name} Tour`, tour });
});

//@@ Logging out Users
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' });
};

//@@ Building the User Account Page
exports.getAccount = (req, res) => {
  res.status(200).render('account', { title: 'Your account' });
};

//@@ Rendering a User's Booked Tours
exports.getMyTours = catchAsync(async (req, res, next) => {
  //* 1. Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //* 2. Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', { title: 'My Tours', tours });
});

//@@ Updating User Data
exports.updateUserData = catchAsync(async (req, res, next) => {
  // console.log('UPDATE USER', req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true }
  );

  res
    .status(200)
    .render('account', { title: 'Your account', user: updatedUser });
});
