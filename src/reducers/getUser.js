import baseState from '../store/baseState';
import { GET_USER, GET_USER_KYC_STATUS, UPDATE_USER, GET_ALL_KYC_REQUESTS } from '../actions/action';
export default (state = baseState.userDetails, { payload, type, error }) => {
    switch (type) {
        case GET_USER.REQUEST:
            return {
                ...state
            };
        case GET_USER.SUCCESS:
            return {
                ...state,
                user: payload.data
            };
        case GET_USER.FAILURE:
            return {
                ...state,
                user: [],
                error: error.message
            };
        case UPDATE_USER.REQUEST:
            return {
                ...state
            };
        case UPDATE_USER.SUCCESS:
            return {
                ...state,
                user: payload.data
            }
        case UPDATE_USER.FAILURE:
            return {
                ...state,
                user: [],
                error: error.message
            }
        case GET_USER_KYC_STATUS.REQUEST:
            return {
                ...state
            };
        case GET_USER_KYC_STATUS.SUCCESS:
            return {
                ...state,
                userKyc: payload.data
            };
        case GET_USER_KYC_STATUS.FAILURE:
            return {
                ...state,
                userKyc: {},
                error: error.message
            };
        case GET_ALL_KYC_REQUESTS.REQUEST:
            return {
                ...state
            };
        case GET_ALL_KYC_REQUESTS.SUCCESS:
            return {
                ...state,
                allKycRequests: payload.data
            };
        case GET_ALL_KYC_REQUESTS.FAILURE:
            return {
                ...state,
                allKycRequests: [],
                error: error.message
            };
        default:
            return state;
    }
};