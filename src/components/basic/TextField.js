import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';

class TextField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hide: 'fa fa-eye-slash'
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    }, () => {
      this.props.handler(name, value);
    });
  }

  inputField = (opts) => {
    return (

      <>

        <span className="input-group-text span-user" ><i className="fa fa-user " aria-hidden="true"></i></span>
        <FormControl className="login-input" id="floatingInputCustom"  {...opts} onChange={this.handleChange} />

      </>
    );
  }


  hideSwitch = ev => {
    if (this.state.hide === 'fa fa-eye-slash') {
      if (document.getElementById('passwordfield')) {
        document.getElementById('passwordfield').type = 'text';
      }
      this.setState({
        hide: 'fa fa-eye',
      })
    }
    else {
      if (document.getElementById('passwordfield')) {
        document.getElementById('passwordfield').type = 'password';
      }
      this.setState({
        hide: 'fa fa-eye-slash',
      })
    }
  }

  passwordField = (opts) => {
    const { hide } = this.state;
    return (
      <>
        <span className="input-group-text span-user" ><i className="fa fa-key " aria-hidden="true"></i></span>
        <FormControl className="login-input" id="floatingInputCustom"  {...opts} onChange={this.handleChange} />
        <span className="input-group-text border-0 bg-transparent view-password" id="basic-addon1"><i onClick={this.hideSwitch} className={hide} aria-hidden="true"></i></span>
      </>


    );
  }

  render() {
    const { name, placeholder, type, required, value, id, readOnly } = this.props;

    const opts = { placeholder, type, required, value, name, id, readOnly };
    let input = 'No mapping';

    switch (type) {
      case 'password':
        input = this.passwordField(opts);
        break;
      default:
        input = this.inputField(opts);
        break;
    }
    return input;
  }
}

TextField.defaultProps = {
  label: '',
  placeholder: '',
  type: '',
  value: '',
  readOnly: false
};

TextField.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  handler: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.any,
  id: PropTypes.string
};

export default TextField;