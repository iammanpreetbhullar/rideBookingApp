import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Spinner from "./common/Spinner";

const Home = lazy(() => import("./home/Home"));
const Login = lazy(() => import("./user/Login"));
const RoutesMap = lazy(() => import("./routesMap/RoutesMap"));
const VehicleLocMap = lazy(() => import("./vehicleLocationMap/VehicleLocMap"));
const Users = lazy(() => import("./persons/PersonsList"));
const Districts = lazy(() => import("./districts/Districts"));
const Locations = lazy(() => import("./locations/Locations"));
const VehicleDetails = lazy(()=> import('./persons/PersonDetails'));
const DriversList = lazy(()=> import('./drivers/DriversList'));
const DriverDetails = lazy(()=> import('./drivers/DriverDetails'));
const KycRequestsList = lazy(()=> import('./kycRequests/KycRequestsList'));

class AppRoutes extends Component {
  state = {
    lat: 30.8201556,
    lng: 75.1720059,
  };

  handleInputChange = (latt, long) => {
    this.setState({ lat: latt, lng: long });
  };

  componentDidMount() {}

  render() {
    const { lat, lng } = this.state;
    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/home" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route
            exact
            path="/map/routes"
            render={() => (
              <RoutesMap
                lat={lat}
                lng={lng}
                handleChange={this.handleInputChange}
              />
            )}
          />
          <Route
            exact
            path="/map/locations"
            render={() => (
              <VehicleLocMap
                lat={lat}
                lng={lng}
                handleChange={this.handleInputChange}
              />
            )}
          />
          <Route exact path="/users" component={Users} />
          <Route exact path="/districts" component={Districts} />
          <Route exact path="/locations" component={Locations} />
          <Route exact path="/vehicleDetails" component={VehicleDetails}></Route> 
          <Route exact path="/drivers" component={DriversList}></Route> 
          <Route exact path="/drivers/:id" component={DriverDetails}></Route> 
          <Route exact path="/kyc-requests-list" component={KycRequestsList}></Route> 
          <Redirect to="/login" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;
