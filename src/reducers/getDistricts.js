import baseState from '../store/baseState';
import { GET_DISTRICTS } from '../actions/action';
export default (state = baseState.getDistricts, { payload, type, error }) => {
    switch (type) {
        case GET_DISTRICTS.REQUEST:
            return {
                ...state
            };
        case GET_DISTRICTS.SUCCESS:
            return {
                ...state,
                districts: payload.data
            };
        case GET_DISTRICTS.FAILURE:
            return {
                ...state,
                districts: [],
                error: error.message
            };        
        default:
            return state;
    }
};