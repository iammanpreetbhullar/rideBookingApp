import baseState from '../store/baseState';
import { GET_LOC_ROUTES } from '../actions/action';
export default (state = baseState.getRoutesData, { payload, type, error }) => {
    switch (type) {
        case GET_LOC_ROUTES.REQUEST:
            return {
                ...state
            };
        case GET_LOC_ROUTES.SUCCESS:
            return {
                ...state,
                routesDetails: payload.data
            };
        case GET_LOC_ROUTES.FAILURE:
            return {
                ...state,
                routesDetails: [],
                error: error.message
            };        
        default:
            return state;
    }
};