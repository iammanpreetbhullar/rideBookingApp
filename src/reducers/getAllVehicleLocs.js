import baseState from '../store/baseState';
import { GET_ALL_VEH_LOCS } from '../actions/action';
export default (state = baseState.getVehicleLocs, { payload, type, error }) => {
    switch (type) {
        case GET_ALL_VEH_LOCS.REQUEST:
            return {
                ...state
            };
        case GET_ALL_VEH_LOCS.SUCCESS:
            return {
                ...state,
                vehicleLocDetails: payload.data
            };
        case GET_ALL_VEH_LOCS.FAILURE:
            return {
                ...state,
                vehicleLocDetails: [],
                error: error.message
            };
        default:
            return state;
    }
};