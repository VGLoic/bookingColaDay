import React from 'react';

/* Methods */
import { connect } from 'react-redux';

/* Components */
import { Alert } from 'reactstrap';

const ErrorAlert = ({ errors }) => (
  <Alert color='danger'>
    {errors}
  </Alert>
)

function mapStateToProps(state) {
  return {
    errors: state.errors.message
  }
}

export default connect(mapStateToProps, null)(ErrorAlert);
