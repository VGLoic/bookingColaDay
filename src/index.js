import React from 'react';
import ReactDOM from 'react-dom';

/* Methods */
import registerServiceWorker from './registerServiceWorker';
import { configureStore, history } from './store';
import { UserIsAuthenticated, UserIsNotAuthenticated } from './util/wrappers';
import jwtDecode from 'jwt-decode';
import { setUser } from './store/actions/auth';

/* Components */
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router';
import Homepage from './containers/Homepage';
import Dashboard from './containers/Dashboard';

/* Styles */
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';

const store = configureStore();

if (localStorage.jwtToken) {
  try {
    store.dispatch(setUser(jwtDecode(localStorage.jwtToken)));
  } catch(err) {
    store.dispatch(setUser(null));
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div className='App'>
        <Route exact path='/dashboard' component={UserIsAuthenticated(Dashboard)} />
        <Route exact path='/' component={UserIsNotAuthenticated(Homepage)} />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
