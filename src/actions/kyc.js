import axios from 'axios';
import { createAction, GET_ALL_KYC_REQUESTS, GET_USER_KYC_REQUEST } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//get all KYCRequests of User
export const getAllKYCRequests = (data) => {
    return createAction({
        type: GET_ALL_KYC_REQUESTS,
        action: () => axios.post(BASE_URL + 'admin/user/requests', data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}

// get Each UserKYCRequest of User
export const getUserKYCRequest = (data) => {
    return createAction({
        type: GET_USER_KYC_REQUEST,
        action: () => axios.get(BASE_URL + 'admin/user/request/' + data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}