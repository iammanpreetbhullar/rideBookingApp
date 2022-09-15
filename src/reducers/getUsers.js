import baseState from '../store/baseState';
import { GET_ALL_USERS } from '../actions/action';
export default (state = baseState.getAllUsers, { payload, type, error }) => {
    switch (type) {
        case GET_ALL_USERS.REQUEST:
            return {
                ...state
            };
        case GET_ALL_USERS.SUCCESS:
            return {
                ...state,
                users: payload.data
            };
        case GET_ALL_USERS.FAILURE:
            return {
                ...state,
                users: {},
                error: error.message
            };        
        default:
            return state;
    }
};