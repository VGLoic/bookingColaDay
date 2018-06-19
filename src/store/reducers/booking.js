import { LOADING_BOOKING, LOAD_BOOKING, LOAD_BOOKING_GUEST } from '../actionTypes';

const DEFAULT_STATE = {
  isLoading: true,
  userBooking: { hasBooked: false, hasBookedGuest: false },
  freeSchedules: [],
  bookedSchedules: [],
  freeSchedulesGuest: []
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case LOADING_BOOKING:
      return { ...state, isLoading: true };
    case LOAD_BOOKING:
      let freeSchedules = JSON.parse(JSON.stringify(action.freeSchedules));
      let bookedSchedules = JSON.parse(JSON.stringify(action.bookedSchedules));
      return {
        ...state,
        isLoading: false,
        userBooking: { ...state.userBooking, ...action.userBooking },
        freeSchedules,
        bookedSchedules
      };
    case LOAD_BOOKING_GUEST:
      let freeSchedulesGuest = JSON.parse(JSON.stringify(action.freeSchedulesGuest));
      return {
        ...state,
        userBooking: { ...state.userBooking, ...action.userBookingGuest },
        freeSchedulesGuest
      };
    default:
      return state;
  }
}
