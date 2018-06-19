import React, { Component } from 'react';

/* Methods */
import { connect } from 'react-redux';
import {
  VisibleOnlyErrors,
  VisibleOnlyFromCoke,
  VisibleOnlyFromPepsi,
  VisibleOnlyFromPartners
} from '../util/wrappers';

/* Components */
import NavBar from '../components/NavBar';
import ErrorAlert from '../components/ErrorAlert';
import PartnersHandler from './Partners/PartnersHandler';
import CokeHandler from './Coke/CokeHandler';

/* Styles */
import '../css/Dashboard.css';

class Dashboard extends Component {

  render() {
    const { user } = this.props;
    const ErrorMessage = VisibleOnlyErrors(ErrorAlert);
    const CokeDisplay = VisibleOnlyFromCoke(() => (
      <CokeHandler />
    ));
    const PepsiDisplay = VisibleOnlyFromPepsi(() => (
      <div className='container text-center pepsi-message'>
        <h3>Welcome Pepsi</h3>
        <p>
          Coke is pleased to work with you for <span className='cola-day'>Cola Day</span>
        </p>
      </div>
    ));
    const PartnersDisplay = VisibleOnlyFromPartners(() => (
      <PartnersHandler
        name={user.data.name}
        pass={user.data.pass}
      />
    ));
    return (
      <div className='dashboard'>
        <NavBar username={user.data.name} />
        <ErrorMessage />
        <PartnersDisplay />
        <CokeDisplay />
        <PepsiDisplay />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, null)(Dashboard);
