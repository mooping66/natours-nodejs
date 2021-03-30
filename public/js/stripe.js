/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

//@@ Processing Payments on the Front-End
const stripe = Stripe(
  //! Developer API KEY
  'pk_test_51IZbKPDzDnI39b4kgmEBuAc5JtCO1ukOqHbFaTO6xzToGZkradglSUZXMiyxa0ginDeLU7Z8qNyDYBb8ce0r6hs700K6jWp9tS'
);

export const bookTour = async (tourId) => {
  try {
    //* 1. Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    //* 2. Create checkout form + chancre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
