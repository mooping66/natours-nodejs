//@@ Setting up the Project Structure
const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

//@@ Creating and Mounting Multiple Routers
// router.get('/', (req, res) => {
//   res.status(200).render('base', { tour: 'The Forest Hiker', user: 'mooping' });
// });
//@@ Finishing Payments with Stripe Webhooks
router.use(viewsController.alerts);

//@@  @@Extending Our Base Template with Blocks
router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.get(
  '/my-tours',
  // bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyTours
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
