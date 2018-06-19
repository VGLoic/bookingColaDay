import rootReducer from './reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

export const history = createHistory();
const routingMiddleware = routerMiddleware(history);

export function configureStore() {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunkMiddleware, routingMiddleware),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
  return store;
}
