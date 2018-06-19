import { START_TRANSACTION, END_TRANSACTION } from '../actionTypes';

const DEFAULT_STATE = { inProgress: false };

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case START_TRANSACTION:
      return { ...state, inProgress: true };
    case END_TRANSACTION:
      return { ...state, inProgress: false };
    default:
      return state;
  }
}
