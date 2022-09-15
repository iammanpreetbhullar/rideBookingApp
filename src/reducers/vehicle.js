import baseState from '../store/baseState';
import { UPDATE_VEHICLE } from '../actions/action';
export default (state = baseState.vehicle, { payload, type, error }) => {
    switch (type) {
        case UPDATE_VEHICLE.REQUEST:
            return {
                ...state
            };
        case UPDATE_VEHICLE.SUCCESS:
            return {
                ...state,
                vehicleDetails: payload.data
            };
        case UPDATE_VEHICLE.FAILURE:
            return {
                ...state,
                vehicleDetails: {},
                error: error.message
            };
        default:
            return state;
    }
};