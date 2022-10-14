import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { Toast } from 'primereact/toast';
import TextField from '../../components/basic/TextField';
import { createSession, invalidateSession } from '../../config/appSession';
import { errorMessage } from '../basic/util/formatter';
import { login, logout, driverLogin, driverLogout } from '../../actions/authentication';
import { Container, Row, Col, Form, Image, Badge, Button } from 'react-bootstrap';
import gif from '../../assets/images/transferLoading.gif';
import masterlogo from '../../assets/images/taxi.png';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {},
            authenticated: false,
            error: false,
            buttonState: '',
            userRole: ""
        };
        this.toast = createRef(null);
    }

    componentDidMount() {
        if (this.props.location.pathname === '/logout') {
            this.userLogout();
        }
        this.getUserRole();
    }

    getUserRole = () => {
        let role = localStorage.getItem("userRole");
        this.setState({
            userRole: role
        })
    }

    userLogout = () => {
        this.props.logout().then(() => {
            if (!this.props.authenticated) {
                invalidateSession();
                this.props.history.push('/login');
            }
        });
    }

    onSubmit = event => {
        if (event.keyCode === 13) {
            this.handleSubmit(event);
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        this.setState({ buttonState: 'Loading' });
        const { formData } = this.state;
        localStorage.setItem("userLogin", this.state.formData.username)
        if (this.validateForm()) {
            this.props.login(formData).then(() => {
                this.initSession();
            });
        }
    }

    initSession = async (args) => {
        const { authenticated, loginDetails, driverDetails } = this.props;
        if (authenticated) {
            if (args === "driverSession") {
                await createSession(driverDetails);
                this.props.history.push('/drivers');
            } else {
                if (loginDetails.statusCode === 401) {
                    this.toast.current.show({ severity: 'error', summary: 'Error', detail: 'Username/Password is incorrect', life: 3000 });
                } else {
                    await createSession(loginDetails);
                    let role = localStorage.getItem("userRole");
                    this.props.history.push('/home');
                }
            }
        }
        this.setState({ buttonState: '' });
    }

    handleChange = (name, value) => {
        const { formData } = this.state;
        this.setState({
            formData: {
                ...formData,
                [name]: value
            },
            authenticated: null,
            userinfo: null
        });
    }

    forgotPasswordHandler = () => {
        let userName = this.state.formData.username;
        if (userName === undefined) {
            userName = 'user';
        }
        alert('Hey ' + userName + ', you can retrieve password from Baby Erp Development Team');
    }

    validateForm = () => {
        return true;
    }

    renderDriversPage = () => {
        let data = {};
        data.username = "driver1";
        data.password = "driver";
        this.props.driverLogin(data).then(() => {
            this.initSession("driverSession")
        });
    }

    render() {
        const { formData, buttonState } = this.state;
        const username = { name: 'username', placeholder: 'Username', type: 'text', value: formData.username, id: 'usernamefield', class: 'form-control form-control-solid placeholder-no-fix', handler: this.handleChange }
        const password = { name: 'password', placeholder: 'Password', type: 'password', value: formData.password, id: 'passwordfield', class: 'form-control form-control-solid placeholder-no-fix', handler: this.handleChange }
        return (
            <>
                <Container fluid className='master-login'>
                    <Row className='g-0 text-center mt-5 p-4'>
                        <a href='/#'>
                            <Image width="250px" src={masterlogo} alt="" />
                        </a>
                    </Row>
                    <Row className='g-0'>
                        <Col sm={6} lg={4} className='master-content p-4'>
                            <Form onSubmit={this.handleSubmit} method="post" onKeyUp={this.onSubmit}>
                                <h5 className='text-center fw-light text-clr-grey fs-2 mb-3'>Sign In</h5>
                                <h5 className='text-center'><Badge className='error-message'>{errorMessage(this.props.error)}</Badge></h5>
                                <Form.Floating className="mb-3 d-flex">
                                    <TextField  {...username} />
                                    <Form.Label htmlFor="floatingInputCustom" className="login-label">Username</Form.Label>
                                </Form.Floating>
                                <Form.Floating className="mb-3 d-flex">
                                    <TextField  {...password} />
                                    <Form.Label htmlFor="floatingInputCustom" className="login-label">Password</Form.Label>
                                </Form.Floating>
                                <div className="form-actions">
                                    {buttonState === 'Loading' ?
                                        <div className="mb-3 mx-3 text-center">

                                            <Image width="100px" className='mx-5' src={gif} />
                                        </div> :
                                        <div className="mb-3 text-center">
                                            <Button type="submit" className='btn text-clr-grey'>Login Now</Button>
                                        </div>}
                                </div>
                                <Row className='g-0'>
                                    <Col lg={6} sm={6} xs={6} className="text-start" >
                                        <label className="rememberme">
                                            <input type="checkbox" role='button' name="remember" value="1" />Remember Me
                                        </label>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                    <Row className='g-0'>
                        <Col sm={6} lg={4} className='master-content-2'>
                            <div className='mx-auto p-3 text-center form-actions-button'>
                                <Button className='btn text-clr-grey ' onClick={this.renderDriversPage}>Driver's List</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <div className="area" >
                    <ul className="circles">
                        <li className="circle-spin" />
                        <li className="circle-spin" />
                        <li />
                        <li className="circle-spin" />
                        <li className="circle-spin" />
                        <li className="circle-spin" />
                        <li className="circle-spin" />
                        <li className="circle-spin" />
                        <li />
                        <li className="circle-spin" />
                    </ul>
                </div>
                <Toast ref={this.toast} position="bottom-right" />
            </>
        )
    }
}

const mapStateToProps = state => {
    console.log(state.authData)
    return {
        loginDetails: state.authData.loginDetails,
        driverDetails: state.authData.driverDetails,
        authenticated: state.authData.authenticated,
        error: state.authData.error
    };
};

const mapDispatchToProps = {
    login, logout, driverLogin, driverLogout
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);