import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './App.scss';
import AppRoutes from './AppRoutes';
import NavBar from './common/Navbar';
import FullScreen from "react-full-screen";
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

class App extends Component {
  state = { isFull: false }
  componentDidMount() {
    this.onRouteChanged();
  }

  goFull = () => {
    console.log("entered.......")
    this.setState({ isFull: true });
  };

  render() {
    let navbarComponent = !this.state.isFullPageLayout ? <NavBar /> : '';
    // let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar /> : '';
    return (
      <>
        <FullScreen
          enabled={this.state.isFull}
          onChange={isFull => this.setState({ isFull })}
        >
          <Container className="app-wrapper p-0 m-0" fluid>

            {/* {sidebarComponent} */}

            <div className="main-panel">
              {navbarComponent}
              <AppRoutes />
            </div>
          </Container>
        </FullScreen>
      </>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    const body = document.querySelector('body');
    if (this.props.location.pathname === '/layout/RtlLayout') {
      body.classList.add('rtl');
    }
    else {
      body.classList.remove('rtl')
    }
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ['/login', '/drivers'];
    for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
      if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
        this.setState({
          isFullPageLayout: true
        })
        document.querySelector('.app-wrapper').classList.add('full-app-wrapper');
        break;
      } else {
        this.setState({
          isFullPageLayout: false
        })
        document.querySelector('.app-wrapper').classList.remove('full-app-wrapper');

      }
    }

    if (this.props.location.pathname === '/home') {
      setTimeout(() => {
        document.getElementById('/home').classList.replace('bg-light-blue', 'bg-light-green')
      }, 300);
    }
    else if (this.props.location.pathname === '/map/routes') {
      document.getElementById('/map/routes').classList.replace('bg-light-blue', 'bg-light-green')
    }
    else if (this.props.location.pathname === '/map/locations') {
      document.getElementById('/map/locations').classList.replace('bg-light-blue', 'bg-light-green')
    }
    else if (this.props.location.pathname === '/users') {
      document.getElementById('/users').classList.replace('bg-light-blue', 'bg-light-green')
    }
    else if (this.props.location.pathname === '/districts') {
      document.getElementById('/districts').classList.replace('bg-light-blue', 'bg-light-green')
    }
    else if (this.props.location.pathname === '/locations') {
      document.getElementById('/locations').classList.replace('bg-light-blue', 'bg-light-green')
    }
    else if (this.props.location.pathname === '/kyc-requests-list') {
      document.getElementById('/kyc-requests-list').classList.replace('bg-light-blue', 'bg-light-green')
    }
  }
}

export default (withRouter(App));