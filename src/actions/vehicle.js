import axios from 'axios';
import { createAction, UPDATE_VEHICLE } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//post location routes
export const updateVehicle = (data) => {
    return createAction({
        type: UPDATE_VEHICLE,
        action: () => axios.put(BASE_URL + 'admin/vehicle/' + data.id, data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}