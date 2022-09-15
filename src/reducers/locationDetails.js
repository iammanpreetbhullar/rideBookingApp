import baseState from '../store/baseState';
import { GET_LOCS_BY_DISTT, GET_LOCS_CATEGORIES, ADD_LOC_DISTT_WISE, UPDATE_LOCATION } from '../actions/action';
export default (state = baseState.locationDetails, { payload, type, error }) => {
    switch (type) {
        case GET_LOCS_BY_DISTT.REQUEST:
            return {
                ...state
            };
        case GET_LOCS_BY_DISTT.SUCCESS:
            return {
                ...state,
                districtLocations: payload.data
            };
        case GET_LOCS_BY_DISTT.FAILURE:
            return {
                ...state,
                districtLocations: {},
                error: error.message
            };

        case GET_LOCS_CATEGORIES.REQUEST:
            return {
                ...state
            };
        case GET_LOCS_CATEGORIES.SUCCESS:
            return {
                ...state,
                locationCategories: payload.data
            };
        case GET_LOCS_CATEGORIES.FAILURE:
            return {
                ...state,
                locationCategories: [],
                error: error.message
            };

        case ADD_LOC_DISTT_WISE.REQUEST:
            return {
                ...state
            };
        case ADD_LOC_DISTT_WISE.SUCCESS:
            return {
                ...state,
                newLocationDetails: payload.data
            };
        case ADD_LOC_DISTT_WISE.FAILURE:
            return {
                ...state,
                newLocationDetails: {},
                error: error.message
            };
            
        case UPDATE_LOCATION.REQUEST:
            return {
                ...state
            };
        case UPDATE_LOCATION.SUCCESS:
            return {
                ...state,
                updatedLocationDetails: payload
            };
        case UPDATE_LOCATION.FAILURE:
            return {
                ...state,
                updatedLocationDetails: null,
                error: error.message
            };
        default:
            return state;
    }
};