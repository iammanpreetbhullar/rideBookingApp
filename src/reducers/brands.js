import baseState from '../store/baseState';
import { GET_BRANDS, GET_BRAND_MODELS  } from '../actions/action';
export default (state = baseState.brandDetails, { payload, type, error }) => {
    switch (type) {
        case GET_BRANDS.REQUEST:
            return {
                ...state
            };
        case GET_BRANDS.SUCCESS:
            return {
                ...state,
                brands: payload.data
            };
        case GET_BRANDS.FAILURE:
            return {
                ...state,
                brands: [],
                error: error.message
            };

        case GET_BRAND_MODELS.REQUEST:
            return {
                ...state
            };
        case GET_BRAND_MODELS.SUCCESS:
            return {
                ...state,
                models: payload.data
            }
        case GET_BRAND_MODELS.FAILURE:
            return {
                ...state,
                models: [],
                error: error.message
            }
        default:
            return state;
    }
};