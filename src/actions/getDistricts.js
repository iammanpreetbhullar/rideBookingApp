import axios from 'axios';
import { createAction, GET_DISTRICTS } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//post location routes
export const getDistricts = (data) => {
    return createAction({
        type: GET_DISTRICTS,
        action: () => axios.post(BASE_URL + 'admin/districts', data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}
