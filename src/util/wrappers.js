import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import LoadingSpinner from '../components/LoadingSpinner';

const locationHelper = locationHelperBuilder({});

export const UserIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/',
  authenticatedSelector: state => state.user.data !== null,
  wrapperDisplayName: 'UserIsAuthenticated',
  authenticatingSelector: state => state.user.isLoading,
  AuthenticatingComponent: LoadingSpinner
})

export const UserIsNotAuthenticated = connectedRouterRedirect({
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/dashboard',
  allowRedirectBack: false,
  authenticatedSelector: state => state.user.data === null,
  wrapperDisplayName: 'UserIsNotAuthenticated'
})

export const VisibleOnlyErrors = connectedAuthWrapper({
  authenticatedSelector: state => state.errors.message !== null,
  wrapperDisplayName: 'VisibleOnlyErrors'
})

export const VisibleOnlyHasBooked = connectedAuthWrapper({
  authenticatedSelector: state => state.booking.userBooking.hasBooked === true,
  wrapperDisplayName: 'VisibleOnlyHasBooked'
})

export const VisibleOnlyHasBookedGuest = connectedAuthWrapper({
  authenticatedSelector: state => state.booking.userBooking.hasBookedGuest === true,
  wrapperDisplayName: 'VisibleOnlyHasBookedGuest'
})

export const VisibleOnlyOnTransaction = connectedAuthWrapper({
  authenticatedSelector: state => state.transaction.inProgress === true,
  wrapperDisplayName: 'VisibleOnlyOnTransaction'
})

export const VisibleOnlyFromCoke = connectedAuthWrapper({
  authenticatedSelector: state => state.user.data.name === 'Coke',
  wrapperDisplayName: 'VisibleOnlyFromCoke'
})

export const VisibleOnlyFromPepsi = connectedAuthWrapper({
  authenticatedSelector: state => state.user.data.name === 'Pepsi',
  wrapperDisplayName: 'VisibleOnlyFromPepsi'
})

export const VisibleOnlyFromPartners = connectedAuthWrapper({
  authenticatedSelector: state => {
    let isCoke = state.user.data.name === 'Coke';
    let isPepsi = state.user.data.name === 'Pepsi';
    return !(isCoke || isPepsi);
  },
  wrapperDisplayName: 'VisibleOnlyFromPartners'
})
