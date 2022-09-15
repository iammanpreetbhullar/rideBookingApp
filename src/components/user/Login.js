import React from 'react';
import { connect } from 'react-redux';
import TextField from '../../components/basic/TextField';
import { createSession, invalidateSession } from '../../config/appSession';
import { errorMessage } from '../basic/util/formatter';
import { login, logout, driverLogin, driverLogout } from '../../actions/authentication';
import { Container, Row, Col, Form, Image, Badge, Button } from 'react-bootstrap';
import gif from '../../assets/images/transferLoading.gif';
import masterlogo from '../../assets/images/taxi.png';
import imgOne from '../../assets/images/ll.png';
import imgTwo from '../../assets/images/burger.png';
import imgThree from '../../assets/images/pizza.png';
import imgFour from '../../assets/images/jjj.png';
import imgFive from '../../assets/images/bucket.png';
import imgSix from '../../assets/images/b22.png';
import imgSeven from '../../assets/images/jjj.png';
import imgEight from '../../assets/images/pizza.png';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      authenticated: false,
      error: false,
      buttonState: '',
      userRole: ""
    }
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

  //original code
  // initSession = () => {
  //   const { authenticated, loginDetails } = this.props;
  //   if (authenticated) {
  //     createSession(loginDetails);
  //     let role = localStorage.getItem("userRole");

  //     this.props.history.push('/users');


  //   }
  //   this.setState({ buttonState: '' });
  // }


  //needs to remove
  initSession = async (args) => {
    const { authenticated, loginDetails, driverDetails } = this.props;
    if (authenticated) {
      if (args === "driverSession") {
        console.log(driverDetails)
        await createSession(driverDetails);
        this.props.history.push('/drivers');
      } else {
        await createSession(loginDetails);
        let role = localStorage.getItem("userRole");
        this.props.history.push('/users');
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
              <Image width="250px" src={masterlogo} alt="" /> </a>
            {/* <span className="logo-text">master<span className="food">food</span> </span> */}
          </Row>
          {/* <Row className='master-content px-5 py-3'> */}
          {/* <Col md={12}>
               <span className="logo-text"> master <span className="food">food</span> </span>
               </Col> */}

          {/* <Col lg={6} sm={6} className='p-3'>
                  <Image width="100%" src={imgd}/>
                </Col> */}
          <Row className='g-0'>
            <Col sm={6} lg={4} className='master-content p-4'>
              <Form onSubmit={this.handleSubmit} method="post" onKeyUp={this.onSubmit}>
                <h5 className='text-center fw-light text-clr-grey fs-2 mb-3'>Sign In</h5>
                <h5 className='text-center'>
                  <Badge className='error-message'>{errorMessage(this.props.error)}</Badge>
                </h5>

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
                  {/* <Col lg={6} sm={6} xs={6} className="text-end" >
                    <label id="forget-password" className='forget-password' onClick={this.forgotPasswordHandler}>Forgot Password?</label>
                  </Col> */}
                  <Col lg={6} sm={6} xs={6} className="text-end" >

                    {/* <label id="forget-password" className='forget-password' onClick={this.renderDriversPage}>Driver's List</label> */}
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
        {/* <div className="login">
          <div className="logo mt-5">
            <a href="index.html">
              <img width="100px" src="assets/layouts/layout/img/logo.png" alt="" /> </a>
            <span className="logo-text d-block ms-2" id='textRemoveBabyErp'>baby<span className="erp">ERP</span> </span>
          </div>
          <div className="content">
            <form onSubmit={this.handleSubmit} method="post" onKeyUp={this.onSubmit}>
              <h3 class="form-title font-green">Sign In</h3>
              <h3><span className='badge yellowGradient loginMessage'>
                {errorMessage(this.props.error)}
              </span></h3>
              <div class="alert alert-danger display-hide">
                <button class="close" data-close="alert"></button>
                <span> Enter any username and password. </span>
              </div>
              <div class="form-floating mb-3 d-flex">
                <TextField  {...username} />
                <label for="floatingInput" className="login-label">Username</label>
              </div>
              <div class="form-floating mb-3 d-flex">
                <TextField  {...password} />
                <label for="floatingInput" className="login-label">Password</label>
              </div>
              <div class="form-actions">
                {buttonState === 'Loading' ?
                  <div className="mb-3 ms-4 me-3 ">
                    <h2 className='ms-5'>
                      <img width="100px" className='loginMessage ms-5 me-5' src="/assets/layouts/layout/img/transferLoading.gif" /></h2>
                  </div> :
                  <div className="mb-3">
                    <button type="submit" class="btn green uppercase">Login</button>
                  </div>}
              </div>
              <div className="row">
                <div className="col-md-6 col-xs-6 text-start">
                  <label class="rememberme check mt-checkbox mt-checkbox-outline">
                    <input type="checkbox" name="remember" value="1" />Remember
                    <span></span>
                  </label>
                </div>
                <div className="col-md-6 col-xs-6 text-end">
                  <a id="forget-password" class="forget-password" onClick={this.forgotPasswordHandler}>Forgot Password?</a>
                </div>
              </div>
            </form>
          </div>
        </div>*/}
        <div className="area" >
          <ul className="circles">
            <li className="circle-spin">
              {/* <Image className='circle-img' src={imgOne} /> */}
            </li>
            <li className="circle-spin">
              {/* <Image className='circle-img' src={imgTwo} /> */}
            </li>
            <li></li>
            <li className="circle-spin">
              {/* <Image className='circle-img' src={imgThree} /> */}
            </li>
            <li className="circle-spin">
              {/* <Image className='circle-img' src={imgFour} /> */}
            </li>
            <li className="circle-spin">
              {/* <Image className='circle-img' src={imgFive} /> */}
            </li>
            <li className="circle-spin">
              {/* <Image className='circle-img' src={imgSix} /> */}
            </li>
            <li className="circle-spin">
              {/* <Image className='circle-img' src={imgSeven} /> */}
            </li>
            <li></li>
            <li className="circle-spin">
              {/* <Image className='circle-img' src={imgEight} /> */}
            </li>
          </ul>
        </div>
      </>
    )
  }

}

const mapStateToProps = state => {
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