//@@  Setting up Express and Basic Routing
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');

//* Start express app
const app = express();

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

//@@ Testing for Secure HTTPS Connections
app.enable('trust proxy');

//* 1. GLOBAL MIDDLEWARE
//@@ Setting up Pug in Express
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//* 1. GLOBAL MIDDLEWARES
//@@ Implementing CORS
//* Implement CORS
app.use(cors());
//* Access-Control-Allow-Origin *
//* api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

// app.options('/api/v1/tours/:id', cors());
app.options('*', cors());

//@@ Serving Static Files
//*Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//@@ Setting Security HTTP Headers
//* Set security HTTP headers
app.use(helmet());

//@@ Using 3rd-Party Middleware
//* Development logging
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//@@ Implementing Rate Limiting
//Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//* Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
app.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

//* Body parser, reading data from body in to req.body
app.use(express.json({ limit: '10kb' }));

//@@ Updating User Data
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

//@@ Data Sanitization
//* Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//* Data sanitization against XSS
app.use(xss());

//@@ Preventing Parameter Pollution
//* Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//@@ Preparing Our App for Deployment
app.use(compression());

//@@ Creating Our Own Middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

//* Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.cookies);
  next();
});

//* 2.ROUTE
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//@@ Handling Unhandled Routes
app.all('*', (req, res, next) => {
  //* 1
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  //* 2
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);
  //* 3
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//@@ Implementing a Global Error Handling Middleware
app.use(globalErrorHandler);

//* 3.START SERVER
module.exports = app;
