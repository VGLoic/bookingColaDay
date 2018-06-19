import { combineReducers } from 'redux';
import user from './user';
import errors from './errors';
import booking from './booking';
import transaction from './transaction';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  user,
  errors,
  booking,
  transaction,
  routing: routerReducer
});

export default rootReducer;
