import {
  fetchCreatedEntity,
  handleResponse,
  makeMultipart,
  makeRequestOptions,
  url,
} from '../common/service.helper';

export const employeeService = {
  getEmployee,
  getEmployeeByEmail,
  getCurrentEmployee,
  makeCurrentEmployee,
  getEmployees,
  saveEmployee,
  uploadFile,
};

function getEmployee(id) {
  return fetch(url(`/employees/${id}`), makeRequestOptions('GET'))
    .then(handleResponse);
}

function getEmployeeByEmail(email) {
  return fetch(url(`/employees/email?email=${encodeURIComponent(email)}`), makeRequestOptions('GET'))
    .then(handleResponse);
}

function getCurrentEmployee() {
  return fetch(url('/employees/user'), makeRequestOptions('GET'))
    .then(handleResponse);
}

function makeCurrentEmployee() {
  return fetch(url('/employees/user'), makeRequestOptions('POST'))
    .then(handleResponse);
}

function getEmployees() {
  return fetch(url('/employees'), makeRequestOptions('GET'))
    .then(handleResponse);
}

function saveEmployee(employee) {
  if (employee.id !== null) {
    return fetch(url(`/employees/${employee.id}`), makeRequestOptions('PUT', { body: JSON.stringify(employee) }))
      .then(() => getEmployee(employee.id));
  }
  return fetch(url('/employees'), makeRequestOptions('POST', {
    body: JSON.stringify(employee),
  }))
    .then(fetchCreatedEntity)
    .then(handleResponse);
}

function uploadFile(employeeId, file) {
  return fetch(url(`/employees/${employeeId}/agreement`), makeMultipart('POST', { file }))
    .then(() => getEmployee(employeeId));
}