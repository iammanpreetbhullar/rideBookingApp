//Actions related to login, logout to Application
export const ACCOUNT__LOGIN = createActionType('ACCOUNT__LOGIN');
export const ACCOUNT__LOGOUT = createActionType('ACCOUNT__LOGOUT');
export const POST_LOC_ROUTES = createActionType('POST_LOC_ROUTES');
export const GET_LOC_ROUTES = createActionType('GET_LOC_ROUTES');
export const GET_ALL_VEH_LOCS = createActionType('GET_ALL_VEH_LOCS');
export const UPDATE_VEH_LOCS = createActionType('UPDATE_VEH_LOCS');
export const GET_ALL_USERS = createActionType('GET_ALL_USERS');
export const GET_DISTRICTS = createActionType('GET_DISTRICTS');
export const GET_LOCS_BY_DISTT = createActionType('GET_LOCS_BY_DISTT');
export const GET_LOCS_CATEGORIES = createActionType('GET_LOCS_CATEGORIES');
export const ADD_LOC_DISTT_WISE = createActionType('ADD_LOC_DISTT_WISE');
export const UPDATE_LOCATION = createActionType('UPDATE_LOCATION');
export const GET_USER = createActionType('GET_USER');
export const UPDATE_USER = createActionType('UPDATE_USER');
export const GET_LEDGER_BY_ID = createActionType('GET_LEDGER_BY_ID');
export const LEDGER = createActionType('LEDGER');
export const UPDATE_VEHICLE_LEDGER = createActionType('UPDATE_VEHICLE_LEDGER')
export const GET_USER_KYC_STATUS = createActionType('GET_USER_KYC_STATUS')
export const GET_BRANDS = createActionType('GET_BRANDS')
export const GET_BRAND_MODELS = createActionType('GET_BRAND_MODELS')
export const UPDATE_VEHICLE = createActionType('UPDATE_VEHICLE')
export const GET_PLANS = createActionType('GET_PLANS')
export const UPDATE_VEHICLE_PLAN = createActionType('UPDATE_VEHICLE_PLAN')
export const GET_ALL_KYC_REQUESTS = createActionType('GET_ALL_KYC_REQUESTS')
export const GET_USER_KYC_REQUEST = createActionType('GET_USER_KYC_REQUEST')
export const UPDATE_USER_KYC = createActionType('UPDATE_USER_KYC')
export const GET_RECENT_RIDES = createActionType('GET_RECENT_RIDES')
export const GET_PAST_RIDES = createActionType('GET_PAST_RIDES')
export const ACCEPT_RIDE = createActionType('ACCEPT_RIDE')
export const CANCEL_RIDE = createActionType('CANCEL_RIDE')
export const DRIVER_LOGIN = createActionType('DRIVER_LOGIN')
export const DRIVER_LOGOUT = createActionType('DRIVER_LOGOUT')
export const UPDATE_USER_ACC_STATUS = createActionType('UPDATE_USER_ACC_STATUS')
export const START_RIDE = createActionType('START_RIDE')
export const COMPLETE_RIDE = createActionType('COMPLETE_RIDE')

export function createAction({ action, headers = {}, type }) {
  return async (dispatch) => {
    dispatch({ type: type.REQUEST, headers });
    try {
      dispatch({ type: type.SUCCESS, headers, payload: await action() });
    } catch (error) {
      dispatch({ type: type.FAILURE, headers, error });
    }
  };
}
export function createActionType(id) {
  return {
    FAILURE: `${id}__FAILURE`,
    REQUEST: `${id}__REQUEST`,
    SUCCESS: `${id}__SUCCESS`,
  };
}