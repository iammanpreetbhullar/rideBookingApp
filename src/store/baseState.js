export default {
  authData: {
    loginDetails: {},
    driverDetails: {},
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
    userAccStatus: "",
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
    plansDetails:[],
    updatedPlanDetails:{},
    error: ''
  },
  rideDetails: {
    recentRides: [],
    pastRides: [],
    acceptedRide: {},
    startedRide: {},
    completedRide: {},
    canceledRide: {},
    error: ''
  },
  kycDetails: {
    userKycRequest: {},
    allKycRequests: [],
    updatedKyc:'',
    error: ''
  }
}