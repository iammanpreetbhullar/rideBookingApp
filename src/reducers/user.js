import baseState from '../store/baseState';
import { GET_USER, UPDATE_USER, UPDATE_USER_ACC_STATUS } from '../actions/action';
export default (state = baseState.userDetails, { payload, type, error }) => {
    switch (type) {
        case GET_USER.REQUEST:
            return {
                ...state
            };
        case GET_USER.SUCCESS:
            return {
                ...state,
                user: payload.data
            };
        case GET_USER.FAILURE:
            return {
                ...state,
                user: [],
                error: error.message
            };
        case UPDATE_USER.REQUEST:
            return {
                ...state
            };
        case UPDATE_USER.SUCCESS:
            return {
                ...state,
                user: payload.data
            }
        case UPDATE_USER.FAILURE:
            return {
                ...state,
                user: [],
                error: error.message
            }
        case UPDATE_USER_ACC_STATUS.REQUEST:
            return {
                ...state
            };
        case UPDATE_USER_ACC_STATUS.SUCCESS:
            return {
                ...state,
                userAccStatus: payload.data
            };
        case UPDATE_USER_ACC_STATUS.FAILURE:
            return {
                ...state,
                userAccStatus: "",
                error: error.message
            };
        default:
            return state;
    }
};