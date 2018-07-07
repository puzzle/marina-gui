import { authenticationService } from './authentication.service';
import { history } from '../app';
import { employeeActions } from '../employee';

export const authenticationConstants = {
  CHECK_LOGIN_REQUEST: 'USERS_CHECK_LOGIN_REQUEST',
  CHECK_LOGIN_SUCCESS: 'USERS_CHECK_LOGIN_SUCCESS',
  CHECK_LOGIN_FAILURE: 'USERS_CHECK_LOGIN_FAILURE',

  LOGOUT: 'USERS_LOGOUT',
};

export const authenticationActions = {
  checkLogin,
  logout,
};

function checkLogin() {
  return (dispatch) => {
    dispatch(request());

    authenticationService.getUser()
      .then(
        (user) => {
          dispatch(success(user));
          history.push('/');
          dispatch(employeeActions.checkEmployee());
        },
        (error) => {
          dispatch(failure(error));
          authenticationService.redirectToLogin();
        },
      );
  };

  function request() {
    return { type: authenticationConstants.CHECK_LOGIN_REQUEST };
  }

  function success(user) {
    return { type: authenticationConstants.CHECK_LOGIN_SUCCESS, user };
  }

  function failure(error) {
    return { type: authenticationConstants.CHECK_LOGIN_FAILURE, error };
  }
}

function logout() {
  return { type: authenticationConstants.LOGOUT };
}
