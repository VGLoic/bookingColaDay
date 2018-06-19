import React, { Component } from 'react';

/* Methods */
import { connect } from 'react-redux';
import { login, firstValidation } from '../store/actions/auth';
import { addError, removeError } from '../store/actions/errors';
import { VisibleOnlyErrors } from '../util/wrappers';

/* Components */
import LoginForm from '../components/LoginForm';
import ErrorAlert from '../components/ErrorAlert';

/* Styles */
import '../css/bubbleBackground.css';
import '../css/pepsi.css';
import '../css/Homepage.css';

/* Logo */
import cokeLogo from '../CocaLogo.svg';

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstKey: '',
      secondKey: '',
      intermediaryValidation: false
    };
  }

  handleChange = e => {
    this.props.dispatch(removeError());
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleLogin = e => {
    e.preventDefault();
    const { firstKey, secondKey } = this.state;
    this.props.login(firstKey, secondKey);
  }

  handleIntermediaryValidation = e => {
    e.preventDefault();
    firstValidation(this.state.firstKey)
      .then(() => {
        this.props.dispatch(removeError());
        this.setState({ intermediaryValidation: true });
      })
      .catch(err => this.props.dispatch(addError('Incorrect key. Permission denied.')))
  }

  render() {
    const { errors } = this.props;
    const { firstKey, secondKey, intermediaryValidation } = this.state;
    const ErrorMessage = VisibleOnlyErrors(ErrorAlert);
    const form = intermediaryValidation ? (
      <LoginForm
        firstKey={firstKey}
        secondKey={secondKey}
        handleChange={this.handleChange}
        handleSubmit={this.handleLogin}
        errors={errors}
        intermediaryValidation={intermediaryValidation}
      />
    ) : (
      <LoginForm
        firstKey={firstKey}
        secondKey={secondKey}
        handleChange={this.handleChange}
        handleSubmit={this.handleIntermediaryValidation}
        errors={errors}
      />
    )
    return (
      <div className='homepage container text-center'>
        <div className='title'>
          <h1>Enjoy <span>Cola Day</span></h1>
          <h3>with</h3>
          <div className='logo'>
            <div className='pepsi'></div>
            <div className='coke-logo'><img src={cokeLogo} alt='coke-logo'/></div>
          </div>
        </div>
        <div className='error-message'>
          <ErrorMessage />
        </div>
        {form}
        <div id="background-wrap">
          <div className="bubble x1"></div>
          <div className="bubble x2"></div>
          <div className="bubble x3"></div>
          <div className="bubble x4"></div>
          <div className="bubble x5"></div>
          <div className="bubble x6"></div>
          <div className="bubble x7"></div>
          <div className="bubble x8"></div>
          <div className="bubble x9"></div>
          <div className="bubble x10"></div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    errors: state.errors.message
  }
}

export default connect(mapStateToProps, { login })(Homepage);
