import { LOADING_BOOKING, LOAD_BOOKING, LOAD_BOOKING_GUEST } from '../actionTypes';
import { addError } from './errors';
import { startTransaction, endTransaction } from './transaction';
import { from, Booking, BookingGuest, web3 } from '../../util/connectors';

export const loadingBooking = () => ({
  type: LOADING_BOOKING
});

export const setBooking = (userBooking, freeSchedules, bookedSchedules) => ({
  type: LOAD_BOOKING,
  userBooking,
  freeSchedules,
  bookedSchedules
});

export const setBookingGuest = (userBookingGuest, freeSchedulesGuest) => ({
  type: LOAD_BOOKING_GUEST,
  userBookingGuest,
  freeSchedulesGuest
});

// Fetch the bookings from only Coke Booking contract
export const fetchBookingState = (name) => {
  return dispatch => {
    let free = [];
    let booked = [];
    fetchSchedules(Booking, free, booked)
      .then(() => Booking.getPartnerInfo(web3.utils.toHex(name)).call({ from }))
      .then(data => {
        let userBooking = {
          hasBooked: data[0],
          roomIndex: Number(data[1]) % 10,
          timeIndex: Math.abs((Number(data[1]) - (Number(data[1]) % 10)) / 10)
        };
        dispatch(setBooking(userBooking, free, booked));
        dispatch(endTransaction());
      })
      .catch(err => dispatch(addError('Unable to retrieve the reservations...')));
  }
}

// Fetch all the bookings from the two booking contracts
export const fetchEntireBookingState = (name) => {
  return dispatch => {
    let free = [];
    let booked = [];
    let freeGuest = [];
    let userBooking;
    fetchSchedules(BookingGuest, freeGuest, [])
      .then(() => fetchSchedules(Booking, free, booked))
      .then(() => Booking.getPartnerInfo(web3.utils.toHex(name)).call({ from }))
      .then(data => {
        userBooking = {
          hasBooked: data[0],
          roomIndex: Number(data[1]) % 10,
          timeIndex: Math.abs((Number(data[1]) - (Number(data[1]) % 10)) / 10)
        };
        return BookingGuest.getPartnerInfo(web3.utils.toHex(name)).call({ from })
      })
      .then(data => {
        let userBookingGuest = {
          hasBookedGuest: data[0],
          roomIndexGuest: Number(data[1]) % 10,
          timeIndexGuest: Math.abs((Number(data[1]) - (Number(data[1]) % 10)) / 10)
        };
        dispatch(setBooking(userBooking, free, booked));
        dispatch(setBookingGuest(userBookingGuest, freeGuest));
        dispatch(endTransaction());
      })
      .catch(err => dispatch(addError('Unable to retrieve the reservations...')));
  }
}

// Do the booking associated to roomIndex and timeIndex for the user associated to pass
export const book = (pass, roomIndex, timeIndex) => {
  return dispatch => {
    dispatch(startTransaction());
    let bookingIndex = timeIndex * 10 + roomIndex;
    return isAddress(pass)
      .then(() => Booking.bookRoom(bookingIndex, pass).send({
        from,
        gas: 300000,
        gasPrice: 10000000000
      }))
      .catch(err => {
        console.log(err);
        dispatch(addError('Operation canceled.'));
      });
  }
}

// Cancel the booking associated to roomIndex and timeIndex for the user associated to pass
export const cancel = (pass, roomIndex, timeIndex) => {
  return dispatch => {
    dispatch(startTransaction());
    let bookingIndex = timeIndex * 10 + roomIndex;
    return isAddress(pass)
      .then(() => Booking.cancelRoom(bookingIndex, pass).send({
        from,
        gas: 300000,
        gasPrice: 10000000000
      }))
      .catch(err => {
        console.log(err);
        dispatch(addError('Operation canceled.'));
      });
  }
}

// Fetch all the time schedules for a given booking contract and fill the free and booked arrays
function fetchSchedules(booking, free, booked) {
  return new Promise((resolve, reject) => {
    fetchOneSchedule(booking, free, booked, 0)
    .then(() => fetchOneSchedule(booking, free, booked, 1))
    .then(() => fetchOneSchedule(booking, free, booked, 2))
    .then(() => fetchOneSchedule(booking, free, booked, 3))
    .then(() => fetchOneSchedule(booking, free, booked, 4))
    .then(() => fetchOneSchedule(booking, free, booked, 5))
    .then(() => fetchOneSchedule(booking, free, booked, 6))
    .then(() => fetchOneSchedule(booking, free, booked, 7))
    .then(() => fetchOneSchedule(booking, free, booked, 8))
    .then(() => fetchOneSchedule(booking, free, booked, 9))
    .then(() => fetchOneSchedule(booking, free, booked, 10))
    .then(() => fetchOneSchedule(booking, free, booked, 11))
    .then(resolve)
    .catch(reject);
  })
}

// Fetch one time schedule with the given booking contract and fill the free and booked arrays
function fetchOneSchedule(booking, free, booked, timeIndex) {
  return new Promise((resolve, reject) => {
    let promisesArray = Array
      .apply(null, {length: 10})
      .map(Number.call, Number)
      .map(i => booking.getSlot(timeIndex * 10 + i).call({ from }));
    Promise.all(promisesArray)
      .then(data => {
        let schedules = data.map(hexName => web3.utils.toAscii(hexName).replace(/[^a-zA-Z0-9]/g, ''));
        let freeSchedules = schedules.map((name, roomIndex) => {
          if(name === '') {
            return roomIndex;
          }
          return 10;
        }).filter(roomNumber => roomNumber !== 10);
        let bookedSchedules = schedules.map((name, roomIndex) => {
          if(name !== '') {
            return { name, roomIndex };
          }
          return 10;
        }).filter(roomNumber => roomNumber !== 10);
        free.push(freeSchedules);
        booked.push(bookedSchedules);
        resolve();
      })
      .catch(err => reject());
  })
}

// Verifies if a string corresponds to an address
function isAddress(pass) {
  return new Promise((resolve, reject) => {
    let check = web3.utils.isAddress(pass);
    if (check) {
      resolve();
    } else {
      reject();
    }
  })
}
