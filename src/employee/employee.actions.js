import { employeeService } from './employee.service';

export const employeeConstants = {
  CHECK_EMPLOYEE_REQUEST: 'CHECK_EMPLOYEE_REQUEST',
  CHECK_EMPLOYEE_SUCCESS: 'CHECK_EMPLOYEE_SUCCESS',
  CHECK_EMPLOYEE_FAILURE: 'CHECK_EMPLOYEE_FAILURE',

  MAKE_EMPLOYEE_REQUEST: 'MAKE_EMPLOYEE_REQUEST',
  MAKE_EMPLOYEE_SUCCESS: 'MAKE_EMPLOYEE_SUCCESS',
  MAKE_EMPLOYEE_FAILURE: 'MAKE_EMPLOYEE_FAILURE',
};

export const employeeActions = {
  checkEmployee,
  makeEmployee,
};

function checkEmployee() {
  return (dispatch) => {
    dispatch(request());

    employeeService.getCurrentEmployee()
      .then(
        (employee) => {
          dispatch(success(employee));
        },
        (error) => {
          dispatch(failure(error));
          dispatch(makeEmployee());
        },
      );
  };

  function request() {
    return { type: employeeConstants.CHECK_EMPLOYEE_REQUEST };
  }

  function success(employee) {
    return { type: employeeConstants.CHECK_EMPLOYEE_SUCCESS, employee };
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
        (error) => {
          dispatch(failure(error));
        },
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
