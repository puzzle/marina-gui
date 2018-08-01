import { authenticationService } from '../auth';

export const MAINNET_EXPLORER_URL = 'https://blockexplorer.com';
export const TESTNET_EXPLORER_URL = 'https://testnet.blockexplorer.com';
export const MAINNET_API_URL = 'https://blockexplorer.com/api';
export const TESTNET_API_URL = 'https://testnet.blockexplorer.com/api';

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

export function makeRequestOptionsExternal(method, obj = {}) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'omit',
    mode: 'cors',
    redirect: 'error',
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

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

export function isProd() {
  return window.location.hostname === 'marina.puzzle.ch';
}

export function getApiUrl() {
  return isProd() ? MAINNET_API_URL : TESTNET_API_URL;
}

export function getExplorerUrl() {
  return isProd() ? MAINNET_EXPLORER_URL : TESTNET_EXPLORER_URL;
}

export function getUtxosForAddress(address) {
  return fetch(`${getApiUrl()}/addrs/${address}/utxo?noCache=1`, makeRequestOptionsExternal('GET'))
    .then(handleResponse);
}

export function getExplorerTxUrl(tx) {
  return `${getExplorerUrl()}/tx/${tx}`;
}
