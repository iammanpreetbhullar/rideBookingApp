import React from 'react';
import { Nav, Button, Navbar, Image, Container, Dropdown } from 'react-bootstrap';
import '../../assets/NavBar.css';
import masterlogo from '../../assets/images/logo.png';


class NavBar extends React.Component {
    state = {
        pathArray: [
            { tabName: 'Dashboard', subPath: '/home' },
            { tabName: 'Manage Routes', subPath: '/map/routes' },
            { tabName: 'Manage Vehicle Locations', subPath: '/map/locations' },
            { tabName: 'Manage Persons', subPath: '/users' },
            { tabName: 'Manage Districts', subPath: '/districts' },
            { tabName: 'Manage Locations', subPath: '/locations' },
            { tabName: 'Manage KYCs', subPath: '/kyc-requests-list' }
        ]
    }

    toggleUserRole = () => {
        localStorage.removeItem('USER')
    }

    render() {
        return (
            <>
                <Navbar className='py-0 bg-white shadow-sm mb-1' sticky='top' collapseOnSelect >
                    <Container fluid>
                        <Navbar.Brand href="#" className='p-0'>
                            <Image width="45px" src={masterlogo} alt="" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                            <Nav>
                                {this.state.pathArray.map((path, idx) => {
                                    return (
                                        <Nav.Link key={idx} className='pe-0' href={path.subPath}>
                                            <Button className=' shadow-none bg-light-blue text-uppercase' id={path.subPath}>{path.tabName}</Button>
                                        </Nav.Link>
                                    )
                                })}
                                <Dropdown className='p-2 pe-0' align="end" >
                                    <Dropdown.Toggle className='shadow-none border-0 bg-light text-dark py-2 text-uppercase' id="dropdown-basic">
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