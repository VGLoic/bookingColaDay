import { START_TRANSACTION, END_TRANSACTION } from '../actionTypes';

export const startTransaction = () => ({
  type: START_TRANSACTION
});

export const endTransaction = () => ({
  type: END_TRANSACTION
});
