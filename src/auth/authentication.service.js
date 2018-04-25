export const url = path => `${process.env.REACT_APP_BACKEND_URL}${path}${process.env.REACT_APP_BACKEND_SUFFIX}`;

export const authenticationService = {
  getUser,
  redirectToLogin,
};

function getUser() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    mode: 'cors',
    redirect: 'error',
  };

  return fetch(url('/user'), requestOptions)
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

function redirectTo(newUrl) {
  if (process.env.NODE_ENV !== 'test') {
    window.location.replace(newUrl);
  }
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}
