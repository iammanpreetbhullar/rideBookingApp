import axios from 'axios';
import { createAction, GET_LOC_ROUTES } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//post location routes
export const getLocationRoutes = (data) => {
    return createAction({
        type: GET_LOC_ROUTES,
        action: () => axios.get(BASE_URL + 'admin/location/' + data + '/routes', { headers: HEADERS.AUTHENTIC() }),
        data
    });
}

