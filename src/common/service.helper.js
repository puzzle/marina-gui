import { authenticationService } from '../auth';

export function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  if (response.status === 201 || response.status === 204) {
    return {};
  }

  if (response.redirected && response.body.indexOf('<html') >= 0) {
    authenticationService.redirectToLogin();
  }

  return response.json();
}

export function fetchCreatedEntity(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  if (response.status === 201 && response.headers.get('Location')) {
    return fetch(response.headers.get('Location'), makeRequestOptions('GET'));
  }

  return response;
}

export function makeRequestOptions(method, obj = {}) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    mode: 'cors',
    redirect: 'follow',
    ...obj,
  };
}

export function makeMultipart(method, params = {}) {
  const formData = new FormData();
  Object.getOwnPropertyNames(params).forEach((name) => {
    formData.append(name, params[name]);
  });
  return {
    method,
    body: formData,
    credentials: 'include',
    mode: 'cors',
    redirect: 'follow',
  };
}

export const url = path => `${process.env.REACT_APP_BACKEND_URL}${path}${process.env.REACT_APP_BACKEND_SUFFIX}`;

export function getValueFromInputChangeEvent(event) {
  const { target } = event;
  switch (target.type) {
    case 'checkbox':
      return target.checked;
    case 'file':
      return target.files[0];
    default:
      return target.value;
  }
}
