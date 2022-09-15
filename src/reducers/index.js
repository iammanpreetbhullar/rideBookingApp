import { combineReducers } from 'redux';
import authData from './authentication';
import postRoutesData from './postRoutes';
import getRoutesData from './getRoutes';
import getVehicleLocs from './getAllVehicleLocs';
import updateVehicleLocs from './postVehicleLocs';
import getAllUsers from './getUsers';
import getDistricts from './getDistricts';
import locationDetails from './locationDetails'
import userDetails from './getUser';
import getLedger from './getLedgerDetail';
import brandDetails from './brands';
import vehicle from './vehicle';
import rideDetails from './drivers';
import kycDetails from './kyc';
export default function createReducer() {
    return combineReducers({
        authData,
        postRoutesData,
        getRoutesData,
        getVehicleLocs,
        updateVehicleLocs,
        getAllUsers,
        getDistricts,
        locationDetails,
        userDetails,
        getLedger,
        brandDetails,
        vehicle,
        rideDetails,
        kycDetails
    });
}