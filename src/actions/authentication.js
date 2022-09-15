import axios from 'axios';
import base64 from 'react-native-base64';
import { createAction, ACCOUNT__LOGIN, ACCOUNT__LOGOUT, DRIVER_LOGIN, DRIVER_LOGOUT } from './action';
import { invalidateSession } from '../config/appSession';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//access login token
export const login = (data) => {
  const encryptData = base64.encode(data.username + ':' + data.password);
  return createAction({
    type: ACCOUNT__LOGIN,
    action: () => axios.post(BASE_URL + 'auth', data, { headers: HEADERS.LOGIN(encryptData) }),
    data
  });
}

//logout from app and remove local token
export function logout() {
  return createAction({
    type: ACCOUNT__LOGOUT,
    action: () => invalidateSession,
  });
}

export const driverLogin = (data) => {
  const encryptData = base64.encode(data.username + ':' + data.password);
  return createAction({
    type: DRIVER_LOGIN,
    action: () => axios.post(BASE_URL + 'auth/driver', data, { headers: HEADERS.LOGIN(encryptData) }),
    data
  });
}

//logout from app and remove local token
export function driverLogout() {
  return createAction({
    type: DRIVER_LOGOUT,
    action: () => invalidateSession,
  });
}