import { employeeService } from './employee.service';

export const employeeConstants = {
  CHECK_EMPLOYEE_REQUEST: 'CHECK_EMPLOYEE_REQUEST',
  CHECK_EMPLOYEE_SUCCESS: 'CHECK_EMPLOYEE_SUCCESS',
  CHECK_EMPLOYEE_FAILURE: 'CHECK_EMPLOYEE_FAILURE',

  MAKE_EMPLOYEE_REQUEST: 'MAKE_EMPLOYEE_REQUEST',
  MAKE_EMPLOYEE_SUCCESS: 'MAKE_EMPLOYEE_SUCCESS',
  MAKE_EMPLOYEE_FAILURE: 'MAKE_EMPLOYEE_FAILURE',

  GET_EMPLOYEES_REQUEST: 'GET_EMPLOYEES_REQUEST',
  GET_EMPLOYEES_SUCCESS: 'GET_EMPLOYEES_SUCCESS',
  GET_EMPLOYEES_FAILURE: 'GET_EMPLOYEES_FAILURE',

  GET_EMPLOYEE_REQUEST: 'GET_EMPLOYEE_REQUEST',
  GET_EMPLOYEE_SUCCESS: 'GET_EMPLOYEE_SUCCESS',
  GET_EMPLOYEE_FAILURE: 'GET_EMPLOYEE_FAILURE',

  SAVE_EMPLOYEE_REQUEST: 'SAVE_EMPLOYEE_REQUEST',
  SAVE_EMPLOYEE_SUCCESS: 'SAVE_EMPLOYEE_SUCCESS',
  SAVE_EMPLOYEE_FAILURE: 'SAVE_EMPLOYEE_FAILURE',

  UPLOAD_EMPLOYEE_AGREEMENT_REQUEST: 'UPLOAD_EMPLOYEE_AGREEMENT_REQUEST',
  UPLOAD_EMPLOYEE_AGREEMENT_SUCCESS: 'UPLOAD_EMPLOYEE_AGREEMENT_SUCCESS',
  UPLOAD_EMPLOYEE_AGREEMENT_FAILURE: 'UPLOAD_EMPLOYEE_AGREEMENT_FAILURE',
};

export const employeeActions = {
  checkEmployee,
  makeEmployee,
  getEmployees,
  getEmployee,
  saveEmployee,
  uploadFile,
};

function checkEmployee() {
  return (dispatch) => {
    dispatch(request());

    employeeService.getCurrentEmployee()
      .then(
        userEmployee => dispatch(success(userEmployee)),
        (error) => {
          dispatch(failure(error));
          dispatch(makeEmployee());
        },
      );
  };

  function request() {
    return { type: employeeConstants.CHECK_EMPLOYEE_REQUEST };
  }

  function success(userEmployee) {
    return { type: employeeConstants.CHECK_EMPLOYEE_SUCCESS, userEmployee };
  }

  function failure(error) {
    return { type: employeeConstants.CHECK_EMPLOYEE_FAILURE, error };
  }
}

function makeEmployee() {
  return (dispatch) => {
    dispatch(request());

    employeeService.makeCurrentEmployee()
      .then(
        () => {
          dispatch(success());
          dispatch(checkEmployee());
        },
        error => dispatch(failure(error)),
      );
  };

  function request() {
    return { type: employeeConstants.MAKE_EMPLOYEE_REQUEST };
  }

  function success() {
    return { type: employeeConstants.MAKE_EMPLOYEE_SUCCESS };
  }

  function failure(error) {
    return { type: employeeConstants.MAKE_EMPLOYEE_FAILURE, error };
  }
}

function getEmployees() {
  return (dispatch) => {
    dispatch(request());

    employeeService.getEmployees()
      .then(
        employees => dispatch(success(employees)),
        error => dispatch(failure(error)),
      );
  };

  function request() {
    return { type: employeeConstants.GET_EMPLOYEES_REQUEST };
  }

  function success(employees) {
    return { type: employeeConstants.GET_EMPLOYEES_SUCCESS, employees };
  }

  function failure(error) {
    return { type: employeeConstants.GET_EMPLOYEES_FAILURE, error };
  }
}

function getEmployee(id) {
  return (dispatch) => {
    dispatch(request());

    employeeService.getEmployee(id)
      .then(
        employee => dispatch(success(employee)),
        error => dispatch(failure(error)),
      );
  };

  function request() {
    return { type: employeeConstants.GET_EMPLOYEE_REQUEST };
  }

  function success(employee) {
    return { type: employeeConstants.GET_EMPLOYEE_SUCCESS, employee };
  }

  function failure(error) {
    return { type: employeeConstants.GET_EMPLOYEE_FAILURE, error };
  }
}

function saveEmployee(employee) {
  return (dispatch) => {
    dispatch(request());

    employeeService.saveEmployee(employee)
      .then(
        (updatedEmployee) => {
          dispatch(success(updatedEmployee));
          dispatch(checkEmployee());
        },
        error => dispatch(failure(error)),
      );
  };

  function request() {
    return { type: employeeConstants.SAVE_EMPLOYEE_REQUEST };
  }

  function success(updatedEmployee) {
    return {
      type: employeeConstants.SAVE_EMPLOYEE_SUCCESS,
      employee: updatedEmployee,
    };
  }

  function failure(error) {
    return { type: employeeConstants.SAVE_EMPLOYEE_FAILURE, error };
  }
}

function uploadFile(employeeId, file) {
  return (dispatch) => {
    dispatch(request());

    employeeService.uploadFile(employeeId, file)
      .then(
        (agreement) => {
          dispatch(success(agreement));
          dispatch(checkEmployee());
        },
        error => dispatch(failure(error)),
      );
  };

  function request() {
    return { type: employeeConstants.UPLOAD_EMPLOYEE_AGREEMENT_REQUEST };
  }

  function success(updatedEmployee) {
    return {
      type: employeeConstants.UPLOAD_EMPLOYEE_AGREEMENT_SUCCESS,
      employee: updatedEmployee,
    };
  }

  function failure(error) {
    return { type: employeeConstants.UPLOAD_EMPLOYEE_AGREEMENT_FAILURE, error };
  }
}
