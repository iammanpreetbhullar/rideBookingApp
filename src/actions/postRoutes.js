import axios from 'axios';
import { createAction, POST_LOC_ROUTES } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//post location routes
export const postLocationRoutes = (data) => {
    return createAction({
        type: POST_LOC_ROUTES,
        action: () => axios.post(BASE_URL + 'admin/location/' + data.id + '/routes', data.routes,{ headers: HEADERS.AUTHENTIC() }),
        data
    });
}

