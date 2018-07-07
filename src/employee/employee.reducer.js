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
