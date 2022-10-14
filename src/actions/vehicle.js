import axios from 'axios';
import { createAction, UPDATE_VEHICLE, GET_PLANS, UPDATE_VEHICLE_PLAN } from './action';

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

export const getSubscriptionPlans = (data) => {
    return createAction({
        type: GET_PLANS,
        action: () => axios.post(BASE_URL + 'admin/plans', data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}

export const updateVehiclePlan = (data) => {
    return createAction({
        type: UPDATE_VEHICLE_PLAN,
        action: () => axios.put(BASE_URL + 'admin/plan/' + data.planId + '/subscribe/' + data.vehicleId, data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}