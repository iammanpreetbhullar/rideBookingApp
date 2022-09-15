export default {
  authData: {
    loginDetails: {},
    driverDetails:{},
    authenticated: false,
    error: ''
  },
  postRoutesData: {
    routesDetails: [],
    error: ''
  },
  getRoutesData: {
    routesDetails: [],
    error: ''
  },
  getVehicleLocs: {
    vehicleLocDetails: [],
    error: ''
  },
  updateVehicleLocs: {
    vehicleLocDetails: [],
    error: ''
  },
  getAllUsers: {
    users: {},
    error: ''
  },
  getDistricts: {
    districts: [],
    error: ''
  },
  locationDetails: {
    districtLocations: {},
    locationCategories: [],
    newLocationDetails: {},
    updatedLocationDetails: null,
    error: ''
  },
  userDetails: {
    user: {},
    error: ''
  },
  getLedger: {
    ledgerById: {},
    ledger: [],
    error: ''
  },
  brandDetails: {
    brands: [],
    models: [],
    error: ''
  },
  vehicle: {
    vehicleDetails: {},
    error: ''
  },
  rideDetails: {
    recentRides: [],
    pastRides: [],
    acceptedRide: {},
    canceledRide: {},
    error: ''
  },
  kycDetails:{
    userKycRequest: {},
    allKycRequests: [],
    error: ''
  }
}