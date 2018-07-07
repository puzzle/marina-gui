import { employeeConstants } from './employee.actions';

const initialState = {};

export function employee(state = initialState, action) {
  switch (action.type) {
    case employeeConstants.CHECK_EMPLOYEE_SUCCESS:
      return {
        employee: action.employee,
      };
    case employeeConstants.CHECK_EMPLOYEE_REQUEST:
      return {};
    case employeeConstants.CHECK_EMPLOYEE_FAILURE:
      return {};
    default:
      return state;
  }
}

export function employees(state = initialState, action) {
  switch (action.type) {
    case employeeConstants.GET_EMPLOYEES_SUCCESS:
      return {
        employees: action.employees,
      };
    case employeeConstants.GET_EMPLOYEES_REQUEST:
      return {};
    case employeeConstants.GET_EMPLOYEES_FAILURE:
      return {};
    default:
      return state;
  }
}
