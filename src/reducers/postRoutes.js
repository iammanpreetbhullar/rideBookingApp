import baseState from '../store/baseState';
import { POST_LOC_ROUTES } from '../actions/action';
export default (state = baseState.postRoutesData, { payload, type, error }) => {
    switch (type) {
        case POST_LOC_ROUTES.REQUEST:
            return {
                ...state
            };
        case POST_LOC_ROUTES.SUCCESS:
            return {
                ...state,
                routesDetails: payload.data
            };
        case POST_LOC_ROUTES.FAILURE:
            return {
                ...state,
                routesDetails: [],
                error: error.message
            };        
        default:
            return state;
    }
};