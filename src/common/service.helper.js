export function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  if (response.status === 201 || response.status === 204) {
    return {};
  }

  return response.json();
}

export function makeRequestOptions(method) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    mode: 'cors',
    redirect: 'error',
  };
}

export const url = path => `${process.env.REACT_APP_BACKEND_URL}${path}${process.env.REACT_APP_BACKEND_SUFFIX}`;
