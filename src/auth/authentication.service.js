import { handleResponse, makeRequestOptions, url } from '../common/service.helper';

export const authenticationService = {
  getUser,
  redirectToLogin,
  redirectToLogout,
};

function getUser() {
  return fetch(url('/user'), makeRequestOptions('GET'))
    .then(handleResponse)
    .then((user) => {
      // login successful if there's a username in the response
      if (user && user.username) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    });
}

function redirectToLogin() {
  redirectTo(url('/sso'));
}

function redirectToLogout() {
  localStorage.removeItem('user');
  redirectTo(url('/ssoLogout'));
}

function redirectTo(newUrl) {
  if (process.env.NODE_ENV !== 'test') {
    window.location.replace(newUrl);
  }
}
