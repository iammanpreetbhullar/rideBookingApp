import axios from 'axios';
import { createAction, GET_LOCS_BY_DISTT, GET_LOCS_CATEGORIES, ADD_LOC_DISTT_WISE, UPDATE_LOCATION } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

//get all users
export const getLocationsByDistrictId = (data) => {
    let url = null;
    url = data.page != undefined && data.pageSize != undefined ? 'admin/district/' + data.id + '/locations?page=' + data.page + '&pageSize=' + data.pageSize : 'admin/district/' + data.id + '/locations'
    return createAction({
        type: GET_LOCS_BY_DISTT,
        action: () => axios.post(BASE_URL + url, data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}

export const getLocationCategories = (data) => {
    return createAction({
        type: GET_LOCS_CATEGORIES,
        action: () => axios.post(BASE_URL + 'admin/location/categorys', data, { headers: HEADERS.AUTHENTIC() }),
        data
    })
}

export const addLocationDistrictWise = (data) => {
    return createAction({
        type: ADD_LOC_DISTT_WISE,
        action: () => axios.post(BASE_URL + 'admin/district/' + data.districtId + '/location', data, { headers: HEADERS.AUTHENTIC() }),
        data
    })
}

export const updateLocation = (data) => {
    return createAction({
        type: UPDATE_LOCATION,
        action: () => axios.put(BASE_URL + 'admin/district/location/' + data.locId, data, { headers: HEADERS.AUTHENTIC() }),
        data
    })
}
