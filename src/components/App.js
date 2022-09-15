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
        if ((this.props.location.pathname).toString().includes('/drivers/')) {
          this.setState({
            isFullPageLayout: true
          })
        } else {
          this.setState({
            isFullPageLayout: false
          })
          document.querySelector('.app-wrapper').classList.remove('full-app-wrapper');
        }
      }
    }
  }
}

export default (withRouter(App));
