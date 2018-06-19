import { SET_USER, LOADING_USER } from '../actionTypes';

const DEFAULT_STATE = { data: null, isLoading: false };

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case LOADING_USER:
      return { ...state, isLoading: true };
    case SET_USER:
      let data = action.user ? { ...action.user } : null;
      return { ...state, data, isLoading: false };
    default:
      return state;
  }
}
