import axios from 'axios';
import { createAction, GET_LEDGER_BY_ID, LEDGER, UPDATE_VEHICLE_LEDGER } from './action';

import { BASE_URL } from '../config/api';
import { HEADERS } from '../config/appHeaders';

export const getLedgerById = (data) => {
    return createAction({
        type: GET_LEDGER_BY_ID,
        action: () => axios.get(BASE_URL + 'admin/vehicle/ledger/' + data, { headers: HEADERS.AUTHENTIC() }),
        data
    });
}

export const getLedgers = (data) => {
    return createAction({
        type: LEDGER,
        action: () => axios.post(BASE_URL + 'admin/vehicle/' + data.id + '/ledger', data, { headers: HEADERS.AUTHENTIC() }),
        data
    })
}

export const updateLedger = (data) => {
    return createAction({
        type: UPDATE_VEHICLE_LEDGER,
        action: () => axios.put(BASE_URL + 'admin/vehicle/ledger/' + data.id, data, { headers: HEADERS.AUTHENTIC() }),
    })
}
