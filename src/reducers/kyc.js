import baseState from '../store/baseState';
import {  GET_USER_KYC_REQUEST,  GET_ALL_KYC_REQUESTS } from '../actions/action';
export default (state = baseState.kycDetails, { payload, type, error }) => {
    switch (type) {
       
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
        case GET_USER_KYC_REQUEST.REQUEST:
            return {
                ...state
            };
        case GET_USER_KYC_REQUEST.SUCCESS:
            return {
                ...state,
                userKycRequest: payload.data
            };
        case GET_USER_KYC_REQUEST.FAILURE:
            return {
                ...state,
                userKycRequest: {},
                error: error.message
            };
        default:
            return state;
    }
};