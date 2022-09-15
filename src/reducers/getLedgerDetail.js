import baseState from '../store/baseState';
import { GET_LEDGER_BY_ID, LEDGER, UPDATE_VEHICLE_LEDGER } from '../actions/action';
export default (state = baseState.getLedger, { payload, type, error }) => {
    switch (type) {
        case GET_LEDGER_BY_ID.REQUEST:
            return {
                ...state
            };
        case GET_LEDGER_BY_ID.SUCCESS:
            return {
                ...state,
                ledgerById: payload.data
            };
        case GET_LEDGER_BY_ID.FAILURE:
            return {
                ...state,
                ledgerById: {},
                error: error.message
            };
        case LEDGER.REQUEST:
            return {
                ...state
            }
        case LEDGER.SUCCESS:
            return {
                ...state,
                ledger: payload.data
            }
        case LEDGER.FAILURE:
            return {
                ...state,
                ledger: [],
                error: ''
            }
        case UPDATE_VEHICLE_LEDGER.REQUEST:
            return {
                ...state
            };
        case UPDATE_VEHICLE_LEDGER.SUCCESS:
            return {
                ...state,
                ledgerById: payload.data
            };
        case UPDATE_VEHICLE_LEDGER.FAILURE:
            return {
                ...state,
                ledgerById: {},
                error: error.message
            }; default:
            return state;
    }
};