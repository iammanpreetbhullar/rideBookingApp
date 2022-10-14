import axios from 'axios';
import { createAction, GET_USER, UPDATE_USER, UPDATE_USER_ACC_STATUS } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//post location routes
export const getUser = (data) => {
    return createAction({
        type: GET_USER,
        action: () => axios.get(BASE_URL + 'admin/user/' + data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}

export const updateUser = (data) => {
    return createAction({
        type: UPDATE_USER,
        action: () => axios.put(BASE_URL + 'admin/person/' + data.id, data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}

export const updateUserAccStatus = (data) => {
    return createAction({
        type: UPDATE_USER_ACC_STATUS,
        action: () => axios.put(BASE_URL + 'admin/user/' + data.userId + '/' + data.status, data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}