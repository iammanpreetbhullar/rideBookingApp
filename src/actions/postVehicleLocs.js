import axios from 'axios';
import { createAction, UPDATE_VEH_LOCS } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//post location routes
export const updateVehicleLocations = (data) => {
    return createAction({
        type: UPDATE_VEH_LOCS,
        action: () => axios.post(BASE_URL + 'admin/vehicle/locations', data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}

