/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// @@Updating User Data with Our API
//* UpdateData
export const updateSettings = async (data, type) => {
  try {
    //@@ Updating User Password with Our API
    //* type is either 'password' or 'data'
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({ method: 'PATCH', url, data });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
