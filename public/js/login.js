/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

//@@ Logging in Users with Our API - Part 1
export const login = async (email, password) => {
  // console.log(email, password);
  //   alert(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      //   alert('Logged in successfully!');
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    // console.log(err.response.data);
    // alert(err.response.data.message);
    showAlert('error', err.response.data.message);
  }
};

//@@ Logging out Users
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if ((res.data.status = 'success')) {
      location.reload(true);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
