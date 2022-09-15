import React from 'react';
import { Nav, Button, Navbar, Image, Container, Dropdown } from 'react-bootstrap';
import '../../assets/NavBar.css';
// import masterlogo from '../../assets/images/rickshaw-logo.png';
import masterlogo from '../../assets/images/taxi.png';


class NavBar extends React.Component {


  
  toggleUserRole=()=>{
    
    localStorage.removeItem('USER')
  }
  render() {
    return (
      <>
        <Navbar className='py-0 bg-white mb-1' sticky='top' collapseOnSelect >
          <Container fluid>
            <Navbar.Brand href="#" className='p-0'>
              <Image width="80px" src={masterlogo} alt="" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
              <Nav>
                <Nav.Link className='pe-0' href="/home">
                  <Button className='rounded-0 shadow-none fw-bold bg-light-blue text-uppercase'>Dashboard</Button>
                </Nav.Link>
                <Nav.Link className='pe-0' href="/map/routes">
                  <Button className='rounded-0 shadow-none fw-bold bg-light-blue text-uppercase'>Manage Routes</Button>
                </Nav.Link>
                <Nav.Link className='pe-0' href="/map/locations">
                  <Button className='rounded-0 shadow-none fw-bold bg-light-blue text-uppercase'>Manage Vehicle Locations</Button>
                </Nav.Link>
                <Nav.Link className='pe-0' href="/users">
                  <Button className='rounded-0 shadow-none fw-bold bg-light-blue text-uppercase'>Manage Persons</Button>
                </Nav.Link>
                <Nav.Link className='pe-0' href="/districts">
                  <Button className='rounded-0 shadow-none fw-bold bg-light-blue text-uppercase'>Manage Districts</Button>
                </Nav.Link>
                <Nav.Link className='pe-0' href="/locations">
                  <Button className='rounded-0 shadow-none fw-bold bg-light-blue text-uppercase'>Manage Locations</Button>
                </Nav.Link>
                <Nav.Link className='pe-0' href="/kyc-requests-list">
                  <Button className='rounded-0 shadow-none fw-bold bg-light-blue text-uppercase'>Manage KYCs</Button>
                </Nav.Link>
                <Dropdown className='p-2 pe-0' align="end" >
                  <Dropdown.Toggle className='rounded-0 shadow-none border-0 bg-light text-dark fw-bold py-2 text-uppercase' id="dropdown-basic">
                    Moga Transport
                  </Dropdown.Toggle>
                  <Dropdown.Menu id="dropdown-menu-align-end">
                    <Dropdown.Item href="/user/login" onClick={this.toggleUserRole}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    )
  }
}

export default NavBar;