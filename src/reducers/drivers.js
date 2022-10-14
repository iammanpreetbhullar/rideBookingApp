import baseState from '../store/baseState';
import { GET_RECENT_RIDES, GET_PAST_RIDES, ACCEPT_RIDE, CANCEL_RIDE, START_RIDE, COMPLETE_RIDE } from '../actions/action';
export default (state = baseState.rideDetails, { payload, type, error }) => {
    switch (type) {
        case GET_RECENT_RIDES.REQUEST:
            return {
                ...state
            };
        case GET_RECENT_RIDES.SUCCESS:
            return {
                ...state,
                recentRides: payload.data
            };
        case GET_RECENT_RIDES.FAILURE:
            return {
                ...state,
                recentRides: [],
                error: error.message
            };
        case GET_PAST_RIDES.REQUEST:
            return {
                ...state
            };
        case GET_PAST_RIDES.SUCCESS:
            return {
                ...state,
                pastRides: payload.data
            }
        case GET_PAST_RIDES.FAILURE:
            return {
                ...state,
                pastRides: [],
                error: error.message
            }
        case ACCEPT_RIDE.REQUEST:
            return {
                ...state
            };
        case ACCEPT_RIDE.SUCCESS:
            return {
                ...state,
                acceptedRide: payload.data
            };
        case ACCEPT_RIDE.FAILURE:
            return {
                ...state,
                acceptedRide: {},
                error: error.message
            };
        case START_RIDE.REQUEST:
            return {
                ...state
            };
        case START_RIDE.SUCCESS:
            return {
                ...state,
                startedRide: payload.data
            };
        case START_RIDE.FAILURE:
            return {
                ...state,
                startedRide: {},
                error: error.message
            };
        case COMPLETE_RIDE.REQUEST:
            return {
                ...state
            };
        case COMPLETE_RIDE.SUCCESS:
            return {
                ...state,
                completedRide: payload.data
            };
        case COMPLETE_RIDE.FAILURE:
            return {
                ...state,
                completedRide: {},
                error: error.message
            };
        case CANCEL_RIDE.REQUEST:
            return {
                ...state
            };
        case CANCEL_RIDE.SUCCESS:
            return {
                ...state,
                canceledRide: payload.data
            };
        case CANCEL_RIDE.FAILURE:
            return {
                ...state,
                canceledRide: {},
                error: error.message
            };
        default:
            return state;
    }
};