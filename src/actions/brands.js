import axios from 'axios';
import { createAction, GET_BRANDS, GET_BRAND_MODELS } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//post location routes
export const getBrands = (data) => {
    return createAction({
        type: GET_BRANDS,
        action: () => axios.post(BASE_URL + 'admin/brands', data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}

export const getBrandModels = (data) => {
    return createAction({
        type: GET_BRAND_MODELS,
        action: () => axios.post(BASE_URL + 'admin/brand/' + data.id + '/models', data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}

