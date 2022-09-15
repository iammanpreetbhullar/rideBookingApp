import axios from 'axios';
import { createAction, GET_RECENT_RIDES, GET_PAST_RIDES, ACCEPT_RIDE, CANCEL_RIDE } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//post location routes
export const getRecentRidesData = (data) => {
    return createAction({
        type: GET_RECENT_RIDES,
        action: () => axios.post(BASE_URL + 'mobile/driver/rides/recent?page=1&pageSize=30', data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}
export const getPastRidesData = (data) => {
    return createAction({
        type: GET_PAST_RIDES,
        action: () => axios.post(BASE_URL + 'mobile/driver/rides/past?page=1&pageSize=30', data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}
export const acceptRide = (data) => {
    return createAction({
        type: ACCEPT_RIDE,
        action: () => axios.put(BASE_URL + 'mobile/driver/ride/' + data.id + '/accept', data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}
export const cancelRide = (data) => {
    return createAction({
        type: CANCEL_RIDE,
        action: () => axios.put(BASE_URL + 'mobile/driver/ride/' + data.id + '/cancel', data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}