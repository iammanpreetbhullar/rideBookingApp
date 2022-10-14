import baseState from '../store/baseState';
import { UPDATE_VEHICLE, GET_PLANS,UPDATE_VEHICLE_PLAN } from '../actions/action';
export default (state = baseState.vehicle, { payload, type, error }) => {
    switch (type) {
        case UPDATE_VEHICLE.REQUEST:
            return {
                ...state
            };
        case UPDATE_VEHICLE.SUCCESS:
            return {
                ...state,
                vehicleDetails: payload.data
            };
        case UPDATE_VEHICLE.FAILURE:
            return {
                ...state,
                vehicleDetails: {},
                error: error.message
            };
        case GET_PLANS.REQUEST:
            return {
                ...state
            };
        case GET_PLANS.SUCCESS:
            return {
                ...state,
                plansDetails: payload.data
            };
        case GET_PLANS.FAILURE:
            return {
                ...state,
                plansDetails: [],
                error: error.message
            };
        case UPDATE_VEHICLE_PLAN.REQUEST:
            return {
                ...state
            };
        case UPDATE_VEHICLE_PLAN.SUCCESS:
            return {
                ...state,
                updatedPlanDetails: payload.data
            };
        case UPDATE_VEHICLE_PLAN.FAILURE:
            return {
                ...state,
                updatedPlanDetails: {},
                error: error.message
            };
        default:
            return state;
    }
};