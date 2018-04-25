import { authenticationConstants } from './authentication.actions';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { user } : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case authenticationConstants.CHECK_LOGIN_REQUEST:
      return {
        user: action.user,
      };
    case authenticationConstants.CHECK_LOGIN_SUCCESS:
      return {
        user: action.user,
      };
    case authenticationConstants.CHECK_LOGIN_FAILURE:
      return {};
    case authenticationConstants.LOGOUT:
      return {};
    default:
      return state;
  }
}
