import baseState from '../store/baseState';
import { ACCOUNT__LOGIN, ACCOUNT__LOGOUT, DRIVER_LOGIN, DRIVER_LOGOUT } from '../actions/action';
export default (state = baseState.authData, { payload, type, error }) => {
  switch (type) {
    case ACCOUNT__LOGIN.REQUEST:
      return {
        ...state,
        authenticated: false
      };
    case ACCOUNT__LOGIN.SUCCESS:
      return {
        ...state,
        loginDetails: payload.data,
        authenticated: true
      };
    case ACCOUNT__LOGIN.FAILURE:
      return {
        ...state,
        loginDetails: {},
        error: error.message,
        authenticated: false
      };
    case ACCOUNT__LOGOUT.SUCCESS:
      return {
        ...state,
        loginDetails: {},
        authenticated: false,
      };

    case DRIVER_LOGIN.REQUEST:
      return {
        ...state,
        authenticated: false
      };
    case DRIVER_LOGIN.SUCCESS:
      return {
        ...state,
        driverDetails: payload.data,
        authenticated: true
      };
    case DRIVER_LOGIN.FAILURE:
      return {
        ...state,
        driverDetails: {},
        error: error.message,
        authenticated: false
      };
    case DRIVER_LOGOUT.SUCCESS:
      return {
        ...state,
        driverDetails: {},
        authenticated: false,
      };
    default:
      return state;
  }
};