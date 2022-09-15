import axios from 'axios';
import { createAction, GET_ALL_USERS } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//get all users
export const getAllUsers = (data) => {
    let url = null;
    url = data.page != undefined && data.pageSize != undefined ? 'admin/users?page=' + data.page + '&pageSize=' + data.pageSize : 'admin/users'
    return createAction({
        type: GET_ALL_USERS,
        action: () => axios.post(BASE_URL + url, data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}

