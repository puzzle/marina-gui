import { employeeConstants } from './employee.actions';

const initialState = {};

export function userEmployee(state = initialState, action) {
  switch (action.type) {
    // new user employee state
    case employeeConstants.CHECK_EMPLOYEE_SUCCESS:
      return {
        userEmployee: action.userEmployee,
      };

    // empty states
    case employeeConstants.CHECK_EMPLOYEE_REQUEST:
      return {};

    default:
      return state;
  }
}

export function employees(state = initialState, action) {
  switch (action.type) {
    // new employee list state
    case employeeConstants.GET_EMPLOYEES_SUCCESS:
      return {
        employees: action.employees,
      };

    // empty states
    case employeeConstants.GET_EMPLOYEES_REQUEST:
    case employeeConstants.GET_EMPLOYEES_FAILURE:
      return {};

    default:
      return state;
  }
}

export function employee(state = initialState, action) {
  switch (action.type) {
    // new employee state
    case employeeConstants.SAVE_EMPLOYEE_SUCCESS:
    case employeeConstants.UPLOAD_EMPLOYEE_AGREEMENT_SUCCESS:
    case employeeConstants.GET_EMPLOYEE_SUCCESS:
      return {
        employee: action.employee,
      };

    // empty states
    case employeeConstants.GET_EMPLOYEE_REQUEST:
    case employeeConstants.GET_EMPLOYEE_FAILURE:
    case employeeConstants.SAVE_EMPLOYEE_REQUEST:
    case employeeConstants.SAVE_EMPLOYEE_FAILURE:
    case employeeConstants.UPLOAD_EMPLOYEE_AGREEMENT_REQUEST:
    case employeeConstants.UPLOAD_EMPLOYEE_AGREEMENT_FAILURE:
      return {};

    default:
      return state;
  }
}
