import { SET_USER, LOADING_USER } from '../actionTypes';
import { addError, removeError } from './errors';
import { setBooking, setBookingGuest, loadingBooking } from './booking';
import { from, web3, PartnersList } from '../../util/connectors';
import { push } from 'react-router-redux'
import jwt from 'jsonwebtoken'

export const loadingUser = () => ({
  type: LOADING_USER
});

export const setUser = user => ({
  type: SET_USER,
  user
});

// Login the user by verifying if the two keys match, then set the user and
// push to /dashboard
export const login = (pass, secretKey) => {
  let user = { pass: pass.toLowerCase() };
  return dispatch => {
    dispatch(loadingUser());
    return keyMatch(pass, secretKey)
      .then(() => PartnersList.getPartnerName(pass).call({ from }))
      .then(hexName => {
        user.name = trimDecodedHex(web3.utils.hexToAscii(hexName));
        let token = jwt.sign(
          user,
          process.env.REACT_APP_JWT_KEY
        );
        localStorage.setItem('jwtToken', token);
        dispatch(setUser(user));
        dispatch(removeError());
        dispatch(push('/dashboard'));
      })
      .catch(err => dispatch(addError('Incorrect pass. Permission denied.')));
  }
}

// Validates the first input, i.e. that the Ethereum address matches with a non empty name
export const firstValidation = pass => {
  return new Promise((resolve, reject) => {
    isAddress(pass)
      .then(() => PartnersList.getPartnerName(pass).call({ from }))
      .then(hexName => {
        let result = web3.utils.hexToAscii(hexName).replace(/[^a-zA-Z0-9]/g, '') !== '';
        if (result) {
          resolve();
        } else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
  })
}

// Logout and remove all data from the local storage and redux store
export const logout = () => {
  return dispatch => {
    localStorage.removeItem('jwtToken');
    dispatch(setBooking({ hasBooked: false }, [], []));
    dispatch(setBookingGuest({ hasBookedGuest: false }, []));
    dispatch(loadingBooking());
    dispatch(setUser(null));
  }
}

// Verifies if a private key and address matches
function keyMatch(pass, secretKey) {
  return new Promise((resolve, reject) => {
    if (web3.eth.accounts.privateKeyToAccount(`0x${secretKey}`).address.toLowerCase() === pass.toLowerCase()) {
      resolve();
    } else {
      reject();
    }
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

// Trims the decoded hex
function trimDecodedHex(str) {
  let i = 0;
  while (str.charCodeAt(i) !== 0 && str.charCodeAt(i+1) !== 0 && i < str.length) {
    i++;
  }
  return str.substring(0, i+1);
}
