import axios from 'axios';
import { createAction, GET_ALL_VEH_LOCS } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//get all locations of district
export const getAllVehicleLocations = (data) => {
    return createAction({
        type: GET_ALL_VEH_LOCS,
        action: () => axios.get(BASE_URL + 'admin/vehicle/locations', { headers: HEADERS.AUTHENTIC() }),
        data
    });
}

