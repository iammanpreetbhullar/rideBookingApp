import baseState from '../store/baseState';
import { UPDATE_VEH_LOCS } from '../actions/action';
export default (state = baseState.updateVehicleLocs, { payload, type, error }) => {
    switch (type) {
        case UPDATE_VEH_LOCS.REQUEST:
            return {
                ...state
            };
        case UPDATE_VEH_LOCS.SUCCESS:
            return {
                ...state,
                vehicleLocDetails: payload.data
            };
        case UPDATE_VEH_LOCS.FAILURE:
            return {
                ...state,
                vehicleLocDetails: [],
                error: error.message
            };
        default:
            return state;
    }
};