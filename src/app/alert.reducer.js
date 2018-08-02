import { alertConstants } from './alert.actions';
import { configurationConstants } from '../employee/configuration.actions';
import { employeeConstants } from '../employee';

export function alert(state = {}, action) {
  // handle error messages in general
  if (action.type && action.type.indexOf('_FAILURE') >= 0) {
    return {
      type: 'alert-danger',
      message: action.message || action.error,
    };
  }

  switch (action.type) {
    case alertConstants.SUCCESS:
      window.scrollTo(0, 0);
      return {
        type: 'alert-success',
        message: action.message,
      };
    case alertConstants.ERROR:
      window.scrollTo(0, 0);
      return {
        type: 'alert-danger',
        message: action.message || action.error,
      };
    case alertConstants.CLEAR:
      return {};

    // success messages
    case configurationConstants.SAVE_CONFIGURATION_SUCCESS:
    case employeeConstants.SAVE_EMPLOYEE_SUCCESS:
    case employeeConstants.UPLOAD_EMPLOYEE_AGREEMENT_SUCCESS:
      return {
        type: 'alert-success',
        message: 'save.success',
      };

    default:
      return state;
  }
}
